import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Octokit } from '@octokit/rest';
import {
  PullRequest,
  PullRequestFile,
  PullRequestReview,
  PullRequestSummary,
} from './github.types';

interface CodeownerRule {
  pattern: string;
  owners: string[];
}

@Injectable()
export class GithubApiService {
  private readonly octokit: Octokit;
  private codeownersCache: Map<string, CodeownerRule[]> = new Map();
  private readonly logger = new Logger(GithubApiService.name, {
    timestamp: true,
  });

  constructor(private readonly configService: ConfigService) {
    const token = this.configService.get<string>('github.token');

    this.octokit = new Octokit({
      auth: token,
    });
  }

  async getPullRequestFiles(
    repo: string,
    prNumber: number,
  ): Promise<PullRequestFile[]> {
    try {
      const { data: files } = await this.octokit.pulls.listFiles({
        owner: 'ResultadosDigitais',
        repo,
        pull_number: prNumber,
      });

      const codeownersRules = await this.getCodeownersRules(repo);

      return files.map((file) => ({
        filename: file.filename,
        status: file.status as 'added' | 'modified' | 'removed',
        additions: file.additions,
        deletions: file.deletions,
        codeowners: this.findCodeownersForFile(file.filename, codeownersRules),
      }));
    } catch (error) {
      this.logger.error('Erro ao buscar arquivos do PR: ' + error.message);
      return [];
    }
  }

  async getPullRequestReviews(
    repo: string,
    prNumber: number,
  ): Promise<PullRequestReview[]> {
    try {
      const { data: reviews } = await this.octokit.pulls.listReviews({
        owner: 'ResultadosDigitais',
        repo,
        pull_number: prNumber,
      });

      const reviewsByUser = new Map<string, PullRequestReview>();

      reviews.forEach((review) => {
        const userLogin = review.user?.login || '';

        const existing = reviewsByUser.get(userLogin);
        if (
          !existing ||
          new Date(review.submitted_at || '') >
            new Date(
              existing.state === 'approved' ? '1970-01-01' : '1970-01-01',
            )
        ) {
          reviewsByUser.set(userLogin, {
            login: userLogin,
            state: review.state as
              | 'approved'
              | 'changes_requested'
              | 'commented',
          });
        }
      });

      return Array.from(reviewsByUser.values());
    } catch (error) {
      this.logger.error('Erro ao buscar reviews do PR: ' + error.message);
      return [];
    }
  }

  async getCodeownersFile(repo: string): Promise<string> {
    const possiblePaths = [
      'CODEOWNERS',
      '.github/CODEOWNERS',
      'docs/CODEOWNERS',
    ];

    for (const path of possiblePaths) {
      try {
        const { data } = await this.octokit.repos.getContent({
          owner: 'ResultadosDigitais',
          repo,
          path,
        });

        if ('content' in data && data.content) {
          return Buffer.from(data.content, 'base64').toString();
        }
      } catch {
        console.log(`CODEOWNERS não encontrado em: ${path}`);
      }
    }

    return '';
  }

  async getPullRequest(repo: string, prNumber: number): Promise<PullRequest> {
    try {
      const { data } = await this.octokit.pulls.get({
        owner: 'ResultadosDigitais',
        repo,
        pull_number: prNumber,
      });

      return {
        url: data.html_url,
        title: data.title,
        body: data.body,
        author: data.user?.login,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        mergedAt: data.merged_at,
        state: data.state,
        commits: data.commits,
        additions: data.additions,
        deletions: data.deletions,
        changedFiles: data.changed_files,
        repoName: repo,
        repoUrl: `https://github.com/ResultadosDigitais/${repo}`,
      };
    } catch (error) {
      this.logger.error('Erro ao buscar PR: ' + error.message);
      throw error;
    }
  }

  async getPullRequestDiff(repo: string, prNumber: number): Promise<string> {
    try {
      const { data } = await this.octokit.pulls.get({
        owner: 'ResultadosDigitais',
        repo,
        pull_number: prNumber,
        mediaType: {
          format: 'diff',
        },
      });

      return data as unknown as string;
    } catch (error) {
      this.logger.error('Erro ao buscar diff do PR: ' + error.message);
      return '';
    }
  }

  async getPullRequestSummary(
    repo: string,
    prNumber: number,
  ): Promise<PullRequestSummary> {
    try {
      const [pullRequest, files, diff, reviews] = await Promise.all([
        this.getPullRequest(repo, prNumber),
        this.getPullRequestFiles(repo, prNumber),
        this.getPullRequestDiff(repo, prNumber),
        this.getPullRequestReviews(repo, prNumber),
      ]);

      return {
        pullRequest,
        files,
        diff,
        reviews,
      };
    } catch (error) {
      this.logger.error('Erro ao buscar resumo do PR: ' + error.message);
      return {
        pullRequest: {
          url: '',
          title: '',
          body: '',
          author: '',
          createdAt: '',
          updatedAt: '',
          mergedAt: '',
          state: '',
          commits: 0,
          additions: 0,
          deletions: 0,
          changedFiles: 0,
          repoName: '',
          repoUrl: '',
        },
        files: [],
        diff: '',
        reviews: [],
      };
    }
  }

  private async getCodeownersRules(repo: string): Promise<CodeownerRule[]> {
    const cacheKey = `ResultadosDigitais/${repo}`;

    if (this.codeownersCache.has(cacheKey)) {
      return this.codeownersCache.get(cacheKey)!;
    }

    const codeownersContent = await this.getCodeownersFile(repo);
    const rules = this.parseCodeownersFile(codeownersContent);

    this.codeownersCache.set(cacheKey, rules);

    return rules;
  }

  private parseCodeownersFile(content: string): CodeownerRule[] {
    const rules: CodeownerRule[] = [];

    if (!content) return rules;

    const lines = content.split('\n');

    for (const line of lines) {
      const trimmedLine = line.trim();

      if (!trimmedLine || trimmedLine.startsWith('#')) {
        continue;
      }

      const parts = trimmedLine.split(/\s+/);
      if (parts.length < 2) continue;

      const pattern = parts[0];
      const owners = parts.slice(1);

      rules.push({
        pattern,
        owners,
      });
    }

    return rules;
  }

  private findCodeownersForFile(
    filename: string,
    rules: CodeownerRule[],
  ): string[] {
    const matchedOwners: string[] = [];

    for (const rule of rules) {
      if (this.matchesPattern(filename, rule.pattern)) {
        matchedOwners.push(...rule.owners);
      }
    }

    return [...new Set(matchedOwners)];
  }

  private matchesPattern(filename: string, pattern: string): boolean {
    const regexPattern =
      pattern
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        .replace(/\\\*/g, '.*')
        .replace(/\\\?/g, '.') + '$';

    try {
      const regex = new RegExp(regexPattern);
      return regex.test(filename);
    } catch (error) {
      this.logger.error(
        'Erro ao processar padrão CODEOWNERS: ' + error.message,
      );
      return false;
    }
  }
}

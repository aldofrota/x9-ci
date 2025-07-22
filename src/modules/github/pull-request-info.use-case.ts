import { Injectable } from '@nestjs/common';
import { PullRequestInfoInput } from './github.types';
import { GithubApiService } from './github-api.service';

@Injectable()
export class PullRequestInfoUseCase {
  constructor(private readonly githubApiService: GithubApiService) {}

  async execute(payload: PullRequestInfoInput): Promise<void> {
    await this.handlePullRequestInfo(payload);
  }

  private async handlePullRequestInfo(
    payload: PullRequestInfoInput,
  ): Promise<void> {
    const { prNumber, owner, repo } = payload;

    // ResultadosDigitais/rdsc-megasac-api/pull/980
    // const pullRequest = await this.githubApiService.getPullRequestFiles(
    //   'ResultadosDigitais',
    //   'rdsc-megasac-api',
    //   980,
    // );

    const codeownersRules = await this.githubApiService.getPullRequestSummary(
      'ResultadosDigitais',
      'rdsc-megasac-api',
      926,
    );

    console.log('codeownersRules', codeownersRules);
  }
}

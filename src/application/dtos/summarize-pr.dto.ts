export class SummarizePrDto {
  constructor(
    public readonly prId: string,
    public readonly repository: string,
    public readonly owner: string,
  ) {}
}

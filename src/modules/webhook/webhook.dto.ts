import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class WebhookDto {
  @IsNumber({}, { message: 'PR deve ser um número' })
  @IsNotEmpty({ message: 'PR é obrigatório' })
  pr: number;

  @IsString({ message: 'Service deve ser uma string' })
  @IsNotEmpty({ message: 'Service é obrigatório' })
  service: string;
}

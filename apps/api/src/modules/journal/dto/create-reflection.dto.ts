import { IsString, IsNotEmpty } from 'class-validator';

export class CreateReflectionDto {
  @IsString()
  @IsNotEmpty()
  entryId: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}

export default CreateReflectionDto;

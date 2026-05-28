import { IsOptional, IsInt, IsISO8601, IsString } from 'class-validator';

export class CreateNutritionDto {
  @IsOptional()
  @IsISO8601()
  timestamp?: string;

  @IsOptional()
  @IsInt()
  calories?: number;

  @IsOptional()
  @IsInt()
  proteinG?: number;

  @IsOptional()
  @IsInt()
  carbsG?: number;

  @IsOptional()
  @IsInt()
  fatG?: number;

  @IsOptional()
  @IsString()
  mealType?: string;
}

export default CreateNutritionDto;

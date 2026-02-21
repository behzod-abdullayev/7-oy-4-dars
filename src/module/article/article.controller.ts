import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ApiBody, ApiConsumes, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import {diskStorage} from "multer"
import path from 'path';
import { CreateArticleSwaggerDto } from './dto/create-swagger-image.dto';


@ApiTags("Article")
@ApiInternalServerErrorResponse({description: "internal server error"})
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}
@ApiOperation({description: "create article api (public)"})
@ApiConsumes("multipart/form-data")
@ApiBody({type: CreateArticleSwaggerDto})
@ApiCreatedResponse({ description: "created"})
@UseInterceptors (
  FileInterceptor("file", {
    storage: diskStorage ({
      destination: path.join(process.cwd(), "uploads"),
      filename: (req, file, cb) => {
        const uniqueName = `${file.fieldname}${Math.random() * 1e9}`
        const ext = path.extname(file.originalname)
        cb(null, `${uniqueName}${ext}`)
      }
    })
  })
)
  @Post()
  create(@Body() createArticleDto: CreateArticleDto, @UploadedFile() file: Express.Multer.File ) {
    return this.articleService.create(createArticleDto, file);
  }

  @ApiOperation({description: "get all articles api (public)"})
  @ApiOkResponse({description: "list of articles"})
  @Get()
  findAll() {
    return this.articleService.findAll();
  }

  @ApiOperation({description: "get one article api (public)"})
  @ApiNotFoundResponse({description: "article not found"})
   @ApiOkResponse({description: "get one article"})
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articleService.findOne(+id);
  }

  @ApiOperation({description: "update article api (owner)"})
  @ApiNotFoundResponse({description: "article not found"})
  @ApiOkResponse({description: "updated article"})
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articleService.update(+id, updateArticleDto);
  }

  @ApiOperation({description: "delete article api (owner)"})
  @ApiOkResponse({description: "deleted article"})
  @ApiNotFoundResponse({description: "article not found"})
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articleService.remove(+id);
  }
}

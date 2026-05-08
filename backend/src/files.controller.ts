import { Controller, Get, Res, Param } from '@nestjs/common';
import { createReadStream, existsSync } from 'fs';
import type { Response } from 'express';
import { join } from 'path';

@Controller('files')
export class FilesController {
    @Get('stream/:filename')
    streamFile(
        @Param('filename') filename: string,
        @Res() res: Response,
    ): Response | void {
        const filePath = join(process.cwd(), 'uploads', filename);

        if (!existsSync(filePath)) {
            return res.status(404).json({ error: 'ファイルが見つかりません' });
        }

        const fileStream = createReadStream(filePath);

        res.setHeader('Content-Type', 'application/octect-stream');
        res.setHeader(
            'Content-Disposition',
            `attachment; filename="${filename}"`,
        );

        fileStream.pipe(res);
    }
}

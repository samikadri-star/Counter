package com.sami.archivecalc.utils

import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.graphics.Paint
import android.graphics.pdf.PdfDocument
import android.net.Uri
import android.widget.Toast
import androidx.core.content.FileProvider
import com.sami.archivecalc.models.WageRecord
import java.io.File
import java.io.FileOutputStream
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

object PdfHelper {
    fun generateAndSharePdf(context: Context, records: List<WageRecord>, ratePerOp: Int) {
        val validRecords = records.filter { it.employeeName.isNotBlank() }
        if (validRecords.isEmpty()) {
            Toast.makeText(context, "لا توجد سجلات لتصديرها", Toast.LENGTH_SHORT).show()
            return
        }

        val pdfDocument = PdfDocument()
        val pageInfo = PdfDocument.PageInfo.Builder(595, 842, 1).create() // A4 size
        val page = pdfDocument.startPage(pageInfo)
        val canvas = page.canvas

        val paint = Paint().apply {
            isAntiAlias = true
        }

        val textPaint = Paint().apply {
            isAntiAlias = true
            color = Color.BLACK
            textSize = 14f
            textAlign = Paint.Align.CENTER
        }

        val headerPaint = Paint().apply {
            isAntiAlias = true
            color = Color.WHITE
            textSize = 18f
            isFakeBoldText = true
            textAlign = Paint.Align.CENTER
        }

        // 1. Blue Title Banner (Image 03 style)
        paint.color = Color.parseColor("#3B82F6")
        canvas.drawRect(20f, 20f, 575f, 75f, paint)

        canvas.drawText("تقرير مستحق الأرشفة", 595f / 2f, 55f, headerPaint)

        // 2. Date row
        val dateFormat = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
        val dateStr = "التاريخ: " + dateFormat.format(Date())
        textPaint.textSize = 13f
        textPaint.isFakeBoldText = true
        canvas.drawText(dateStr, 595f / 2f, 105f, textPaint)

        // 3. Table Header
        paint.color = Color.parseColor("#9384D1")
        canvas.drawRect(20f, 125f, 575f, 160f, paint)

        headerPaint.textSize = 13f
        canvas.drawText("الاسم", 460f, 148f, headerPaint)
        canvas.drawText("عدد العمليات", 300f, 148f, headerPaint)
        canvas.drawText("المبلغ المستحق", 120f, 148f, headerPaint)

        // Draw Table Grid & Rows
        var currentY = 160f
        var grandOps = 0
        var grandAmount = 0
        val rowHeight = 35f

        val cellBorderPaint = Paint().apply {
            color = Color.BLACK
            strokeWidth = 1f
            style = Paint.Style.STROKE
        }

        val rowBgPaint = Paint()

        for (i in validRecords.indices) {
            val r = validRecords[i]
            val ops = r.totalOperations()
            val due = r.totalDueAmount()
            grandOps += ops
            grandAmount += due

            rowBgPaint.color = if (i % 2 == 0) Color.parseColor("#ECE9FE") else Color.parseColor("#FFFFFF")
            canvas.drawRect(20f, currentY, 575f, currentY + rowHeight, rowBgPaint)
            canvas.drawRect(20f, currentY, 575f, currentY + rowHeight, cellBorderPaint)

            textPaint.isFakeBoldText = false
            textPaint.textSize = 12f
            canvas.drawText(r.employeeName, 460f, currentY + 22f, textPaint)
            textPaint.isFakeBoldText = true
            canvas.drawText(ops.toString(), 300f, currentY + 22f, textPaint)
            canvas.drawText("$due ريال", 120f, currentY + 22f, textPaint)

            currentY += rowHeight
        }

        // Summary Total Row
        paint.color = Color.parseColor("#EDE9FE")
        canvas.drawRect(20f, currentY, 575f, currentY + 40f, paint)
        canvas.drawRect(20f, currentY, 575f, currentY + 40f, cellBorderPaint)

        textPaint.textSize = 13f
        textPaint.isFakeBoldText = true
        canvas.drawText("الإجمالي العام (${validRecords.size} مستفيد)", 460f, currentY + 25f, textPaint)
        canvas.drawText("$grandOps عملية", 300f, currentY + 25f, textPaint)
        canvas.drawText("$grandAmount ريال", 120f, currentY + 25f, textPaint)

        currentY += 40f

        // Developer signature footer (Image 03)
        val devPaint = Paint().apply {
            isAntiAlias = true
            color = Color.BLACK
            textSize = 12f
            isFakeBoldText = true
            textAlign = Paint.Align.CENTER
        }
        canvas.drawText("تصميم وتطوير: سامي القادري  |  777484160", 595f / 2f, 800f, devPaint)

        pdfDocument.finishPage(page)

        // Save PDF to cache and launch Share / View Intent
        try {
            val file = File(context.cacheDir, "تقرير_مستحق_الأرشفة_${System.currentTimeMillis()}.pdf")
            val outputStream = FileOutputStream(file)
            pdfDocument.writeTo(outputStream)
            pdfDocument.close()
            outputStream.close()

            val uri: Uri = FileProvider.getUriForFile(context, "${context.packageName}.fileprovider", file)
            val intent = Intent(Intent.ACTION_SEND).apply {
                type = "application/pdf"
                putExtra(Intent.EXTRA_STREAM, uri)
                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            }
            context.startActivity(Intent.createChooser(intent, "تصدير ومشاركة تقرير مستحق الأرشفة"))
        } catch (e: Exception) {
            e.printStackTrace()
            Toast.makeText(context, "حدث خطأ أثناء إنشاء ملف PDF: ${e.message}", Toast.LENGTH_LONG).show()
        }
    }
}

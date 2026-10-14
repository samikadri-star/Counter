package com.sami.archivecalc

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.ImageButton
import android.widget.TextView
import android.widget.Toast
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.sami.archivecalc.adapters.WageRecordAdapter
import com.sami.archivecalc.models.WageRecord
import com.sami.archivecalc.utils.PdfHelper
import com.sami.archivecalc.utils.StorageManager

class MainActivity : AppCompatActivity() {

    private lateinit var storageManager: StorageManager
    private lateinit var recordsList: MutableList<WageRecord>
    private lateinit var adapter: WageRecordAdapter

    private lateinit var tvGrandTotalOps: TextView
    private lateinit var tvGrandTotalAmount: TextView
    private lateinit var btnRatePerOp: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        storageManager = StorageManager(this)
        recordsList = storageManager.getCurrentRecords()

        tvGrandTotalOps = findViewById(R.id.tvGrandTotalOps)
        tvGrandTotalAmount = findViewById(R.id.tvGrandTotalAmount)
        btnRatePerOp = findViewById(R.id.btnRatePerOp)

        val btnExitApp: ImageButton = findViewById(R.id.btnExitApp)
        val btnAddRecord: Button = findViewById(R.id.btnAddRecord)
        val btnArchiveBatch: Button = findViewById(R.id.btnArchiveBatch)
        val btnClearInputs: Button = findViewById(R.id.btnClearInputs)
        val btnPrintPdf: Button = findViewById(R.id.btnPrintPdf)
        val btnOpenNamesManager: Button = findViewById(R.id.btnOpenNamesManager)
        val rvWageRecords: RecyclerView = findViewById(R.id.rvWageRecords)

        updateRateButtonText()

        btnRatePerOp.setOnClickListener {
            showEditRateDialog()
        }

        btnExitApp.setOnClickListener {
            showExitConfirmDialog()
        }

        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                showExitConfirmDialog()
            }
        })

        fun refreshSummary() {
            var grandOps = 0
            var grandAmount = 0
            for (r in recordsList) {
                grandOps += r.totalOperations()
                grandAmount += r.totalDueAmount()
            }
            tvGrandTotalOps.text = "$grandOps عملية"
            tvGrandTotalAmount.text = "$grandAmount ريال"
            storageManager.saveCurrentRecords(recordsList)
        }

        val names = storageManager.getNames()
        adapter = WageRecordAdapter(
            records = recordsList,
            availableNames = names,
            onRecordUpdated = { refreshSummary() },
            onRecordDeleted = { pos ->
                if (recordsList.size > 1) {
                    recordsList.removeAt(pos)
                    adapter.notifyDataSetChanged()
                    refreshSummary()
                } else {
                    Toast.makeText(this, "يجب أن يبقى سجل واحد على الأقل", Toast.LENGTH_SHORT).show()
                }
            }
        )

        rvWageRecords.layoutManager = LinearLayoutManager(this)
        rvWageRecords.adapter = adapter
        refreshSummary()

        btnAddRecord.setOnClickListener {
            val nextName = storageManager.getNames().firstOrNull()?.name ?: ""
            recordsList.add(WageRecord(employeeName = nextName, ratePerOp = storageManager.getRatePerOp()))
            adapter.notifyItemInserted(recordsList.size - 1)
            refreshSummary()
        }

        btnArchiveBatch.setOnClickListener {
            val ops = recordsList.sumOf { it.totalOperations() }
            if (ops == 0) {
                Toast.makeText(this, "لا توجد عمليات مدخلة لترحيلها", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }
            AlertDialog.Builder(this)
                .setTitle("تأكيد الترحيل")
                .setMessage("هل ترغب في ترحيل وحفظ مستحقات هذا الأسبوع؟")
                .setPositiveButton("نعم، ترحيل") { _, _ ->
                    storageManager.saveCurrentRecords(recordsList)
                    Toast.makeText(this, "تم ترحيل وحفظ مستحقات الأسبوع بنجاح!", Toast.LENGTH_LONG).show()
                }
                .setNegativeButton("إلغاء", null)
                .show()
        }

        btnClearInputs.setOnClickListener {
            AlertDialog.Builder(this)
                .setTitle("تأكيد مسح الحقول")
                .setMessage("هل أنت متأكد من تصفير جميع أعداد العمليات المدخلة؟")
                .setPositiveButton("مسح") { _, _ ->
                    for (r in recordsList) {
                        r.days.sat = 0
                        r.days.sun = 0
                        r.days.mon = 0
                        r.days.tue = 0
                        r.days.wed = 0
                        r.days.thu = 0
                    }
                    adapter.notifyDataSetChanged()
                    refreshSummary()
                    Toast.makeText(this, "تم تصفير الحقول بنجاح", Toast.LENGTH_SHORT).show()
                }
                .setNegativeButton("إلغاء", null)
                .show()
        }

        btnPrintPdf.setOnClickListener {
            PdfHelper.generateAndSharePdf(this, recordsList, storageManager.getRatePerOp())
        }

        btnOpenNamesManager.setOnClickListener {
            startActivity(Intent(this, NamesActivity::class.java))
        }
    }

    override fun onResume() {
        super.onResume()
        // Reload names in case names were added or removed
        val names = storageManager.getNames()
        adapter = WageRecordAdapter(
            records = recordsList,
            availableNames = names,
            onRecordUpdated = {
                var grandOps = 0
                var grandAmount = 0
                for (r in recordsList) {
                    grandOps += r.totalOperations()
                    grandAmount += r.totalDueAmount()
                }
                tvGrandTotalOps.text = "$grandOps عملية"
                tvGrandTotalAmount.text = "$grandAmount ريال"
                storageManager.saveCurrentRecords(recordsList)
            },
            onRecordDeleted = { pos ->
                if (recordsList.size > 1) {
                    recordsList.removeAt(pos)
                    adapter.notifyDataSetChanged()
                }
            }
        )
        findViewById<RecyclerView>(R.id.rvWageRecords).adapter = adapter
    }

    private fun updateRateButtonText() {
        btnRatePerOp.text = "${storageManager.getRatePerOp()} ريال/عملية"
    }

    private fun showEditRateDialog() {
        val input = EditText(this).apply {
            inputType = android.text.InputType.TYPE_CLASS_NUMBER
            setText(storageManager.getRatePerOp().toString())
        }
        AlertDialog.Builder(this)
            .setTitle("تعديل سعر العملية")
            .setMessage("أدخل قيمة العملية الواحدة بالريال:")
            .setView(input)
            .setPositiveButton("حفظ") { _, _ ->
                val newRate = input.text.toString().toIntOrNull() ?: 17
                storageManager.setRatePerOp(newRate)
                for (r in recordsList) {
                    r.ratePerOp = newRate
                }
                updateRateButtonText()
                adapter.notifyDataSetChanged()
                val grandAmount = recordsList.sumOf { it.totalDueAmount() }
                tvGrandTotalAmount.text = "$grandAmount ريال"
            }
            .setNegativeButton("إلغاء", null)
            .show()
    }

    private fun showExitConfirmDialog() {
        AlertDialog.Builder(this)
            .setTitle("تأكيد الخروج من التطبيق")
            .setMessage("هل أنت متأكد من رغبتك في إغلاق التطبيق؟ تأكد من ترحيل وحفظ بيانات الأسبوع الحالي.")
            .setPositiveButton("تأكيد الخروج") { _, _ ->
                finishAffinity()
            }
            .setNegativeButton("البقاء في التطبيق", null)
            .show()
    }
}

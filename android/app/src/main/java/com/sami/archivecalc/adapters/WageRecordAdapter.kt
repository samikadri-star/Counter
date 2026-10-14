package com.sami.archivecalc.adapters

import android.text.Editable
import android.text.TextWatcher
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.AdapterView
import android.widget.ArrayAdapter
import android.widget.EditText
import android.widget.ImageButton
import android.widget.Spinner
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.sami.archivecalc.R
import com.sami.archivecalc.models.EmployeeName
import com.sami.archivecalc.models.WageRecord

class WageRecordAdapter(
    private val records: MutableList<WageRecord>,
    private val availableNames: List<EmployeeName>,
    private val onRecordUpdated: () -> Unit,
    private val onRecordDeleted: (Int) -> Unit
) : RecyclerView.Adapter<WageRecordAdapter.RecordViewHolder>() {

    inner class RecordViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val tvCardIndex: TextView = itemView.findViewById(R.id.tvCardIndex)
        val spnEmployeeName: Spinner = itemView.findViewById(R.id.spnEmployeeName)
        val btnDeleteRecord: ImageButton = itemView.findViewById(R.id.btnDeleteRecord)

        val etSat: EditText = itemView.findViewById(R.id.etSat)
        val etTue: EditText = itemView.findViewById(R.id.etTue)
        val etSun: EditText = itemView.findViewById(R.id.etSun)
        val etWed: EditText = itemView.findViewById(R.id.etWed)
        val etMon: EditText = itemView.findViewById(R.id.etMon)
        val etThu: EditText = itemView.findViewById(R.id.etThu)

        val tvTotalOps: TextView = itemView.findViewById(R.id.tvTotalOps)
        val tvTotalAmount: TextView = itemView.findViewById(R.id.tvTotalAmount)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecordViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_wage_card, parent, false)
        return RecordViewHolder(view)
    }

    override fun onBindViewHolder(holder: RecordViewHolder, position: Int) {
        val record = records[position]
        holder.tvCardIndex.text = (position + 1).toString()

        // Setup Spinner
        val nameOptions = mutableListOf("-- اختار الاسم --")
        nameOptions.addAll(availableNames.map { it.name })
        val spinnerAdapter = ArrayAdapter(holder.itemView.context, android.R.layout.simple_spinner_dropdown_item, nameOptions)
        holder.spnEmployeeName.adapter = spinnerAdapter

        val selectedIdx = nameOptions.indexOf(record.employeeName)
        if (selectedIdx >= 0) {
            holder.spnEmployeeName.setSelection(selectedIdx)
        }

        holder.spnEmployeeName.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
            override fun onItemSelected(parent: AdapterView<*>?, view: View?, pos: Int, id: Long) {
                if (pos > 0) {
                    record.employeeName = nameOptions[pos]
                }
            }
            override fun onNothingSelected(parent: AdapterView<*>?) {}
        }

        // Set inputs
        holder.etSat.setText(if (record.days.sat == 0) "" else record.days.sat.toString())
        holder.etTue.setText(if (record.days.tue == 0) "" else record.days.tue.toString())
        holder.etSun.setText(if (record.days.sun == 0) "" else record.days.sun.toString())
        holder.etWed.setText(if (record.days.wed == 0) "" else record.days.wed.toString())
        holder.etMon.setText(if (record.days.mon == 0) "" else record.days.mon.toString())
        holder.etThu.setText(if (record.days.thu == 0) "" else record.days.thu.toString())

        fun updateTotals() {
            val ops = record.totalOperations()
            val due = record.totalDueAmount()
            holder.tvTotalOps.text = ops.toString()
            holder.tvTotalAmount.text = "$due ريال"
            onRecordUpdated()
        }

        updateTotals()

        fun bindWatcher(editText: EditText, onValChanged: (Int) -> Unit) {
            editText.addTextChangedListener(object : TextWatcher {
                override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
                override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                    val num = s?.toString()?.toIntOrNull() ?: 0
                    onValChanged(num)
                    updateTotals()
                }
                override fun afterTextChanged(s: Editable?) {}
            })
        }

        bindWatcher(holder.etSat) { record.days.sat = it }
        bindWatcher(holder.etTue) { record.days.tue = it }
        bindWatcher(holder.etSun) { record.days.sun = it }
        bindWatcher(holder.etWed) { record.days.wed = it }
        bindWatcher(holder.etMon) { record.days.mon = it }
        bindWatcher(holder.etThu) { record.days.thu = it }

        holder.btnDeleteRecord.setOnClickListener {
            onRecordDeleted(holder.adapterPosition)
        }
    }

    override fun getItemCount(): Int = records.size
}

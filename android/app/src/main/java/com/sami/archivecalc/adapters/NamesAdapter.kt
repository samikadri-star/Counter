package com.sami.archivecalc.adapters

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageButton
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.sami.archivecalc.R
import com.sami.archivecalc.models.EmployeeName

class NamesAdapter(
    private val names: MutableList<EmployeeName>,
    private val onDeleteClicked: (EmployeeName) -> Unit
) : RecyclerView.Adapter<NamesAdapter.NameViewHolder>() {

    inner class NameViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val tvNameIndex: TextView = itemView.findViewById(R.id.tvNameIndex)
        val tvEmployeeNameItem: TextView = itemView.findViewById(R.id.tvEmployeeNameItem)
        val btnDeleteName: ImageButton = itemView.findViewById(R.id.btnDeleteName)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): NameViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_name_row, parent, false)
        return NameViewHolder(view)
    }

    override fun onBindViewHolder(holder: NameViewHolder, position: Int) {
        val item = names[position]
        holder.tvNameIndex.text = (position + 1).toString()
        holder.tvEmployeeNameItem.text = item.name
        holder.btnDeleteName.setOnClickListener {
            onDeleteClicked(item)
        }
    }

    override fun getItemCount(): Int = names.size
}

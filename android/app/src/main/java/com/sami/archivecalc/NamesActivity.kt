package com.sami.archivecalc

import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.ImageButton
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.sami.archivecalc.adapters.NamesAdapter
import com.sami.archivecalc.models.EmployeeName
import com.sami.archivecalc.utils.StorageManager

class NamesActivity : AppCompatActivity() {

    private lateinit var storageManager: StorageManager
    private lateinit var namesList: MutableList<EmployeeName>
    private lateinit var adapter: NamesAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_names_manager)

        storageManager = StorageManager(this)
        namesList = storageManager.getNames()

        val btnBack: ImageButton = findViewById(R.id.btnBack)
        val etNewEmployeeName: EditText = findViewById(R.id.etNewEmployeeName)
        val btnSaveName: Button = findViewById(R.id.btnSaveName)
        val rvNamesList: RecyclerView = findViewById(R.id.rvNamesList)

        btnBack.setOnClickListener {
            finish()
        }

        adapter = NamesAdapter(namesList) { item ->
            namesList.remove(item)
            storageManager.saveNames(namesList)
            adapter.notifyDataSetChanged()
            Toast.makeText(this, "تم حذف الاسم بنجاح", Toast.LENGTH_SHORT).show()
        }

        rvNamesList.layoutManager = LinearLayoutManager(this)
        rvNamesList.adapter = adapter

        btnSaveName.setOnClickListener {
            val nameText = etNewEmployeeName.text.toString().trim()
            if (nameText.isEmpty()) {
                Toast.makeText(this, "يرجى كتابة الاسم أولاً", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            if (namesList.any { it.name.equals(nameText, ignoreCase = true) }) {
                Toast.makeText(this, "هذا الاسم مسجل مسبقاً", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val newEntry = EmployeeName(name = nameText)
            namesList.add(0, newEntry)
            storageManager.saveNames(namesList)
            adapter.notifyDataSetChanged()
            etNewEmployeeName.setText("")
            Toast.makeText(this, "تم حفظ الاسم بنجاح", Toast.LENGTH_SHORT).show()
        }
    }
}

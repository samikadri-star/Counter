package com.sami.archivecalc.utils

import android.content.Context
import android.content.SharedPreferences
import com.sami.archivecalc.models.EmployeeName
import com.sami.archivecalc.models.WageRecord
import org.json.JSONArray
import org.json.JSONObject

class StorageManager(context: Context) {
    private val prefs: SharedPreferences = context.getSharedPreferences("archive_calc_prefs", Context.MODE_PRIVATE)

    companion object {
        private const val KEY_NAMES = "key_employee_names"
        private const val KEY_RATE = "key_rate_per_op"
        private const val KEY_RECORDS = "key_current_records"
    }

    fun getRatePerOp(): Int {
        return prefs.getInt(KEY_RATE, 17)
    }

    fun setRatePerOp(rate: Int) {
        prefs.edit().putInt(KEY_RATE, rate).apply()
    }

    fun getNames(): MutableList<EmployeeName> {
        val json = prefs.getString(KEY_NAMES, null)
        val list = mutableListOf<EmployeeName>()
        if (json != null) {
            try {
                val array = JSONArray(json)
                for (i in 0 until array.length()) {
                    val obj = array.getJSONObject(i)
                    list.add(EmployeeName(obj.getString("id"), obj.getString("name")))
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
        if (list.isEmpty()) {
            list.add(EmployeeName("1", "سامي القادري"))
            list.add(EmployeeName("2", "أحمد بن محمد"))
            list.add(EmployeeName("3", "علي حسن الشامي"))
            list.add(EmployeeName("4", "خالد عبدالله الزبيري"))
            saveNames(list)
        }
        return list
    }

    fun saveNames(names: List<EmployeeName>) {
        val array = JSONArray()
        for (item in names) {
            val obj = JSONObject()
            obj.put("id", item.id)
            obj.put("name", item.name)
            array.put(obj)
        }
        prefs.edit().putString(KEY_NAMES, array.toString()).apply()
    }

    fun getCurrentRecords(): MutableList<WageRecord> {
        val json = prefs.getString(KEY_RECORDS, null)
        val list = mutableListOf<WageRecord>()
        if (json != null) {
            try {
                val array = JSONArray(json)
                for (i in 0 until array.length()) {
                    val obj = array.getJSONObject(i)
                    val rec = WageRecord(
                        id = obj.getString("id"),
                        employeeName = obj.optString("employeeName", ""),
                        ratePerOp = obj.optInt("ratePerOp", 17)
                    )
                    val daysObj = obj.optJSONObject("days")
                    if (daysObj != null) {
                        rec.days.sat = daysObj.optInt("sat", 0)
                        rec.days.sun = daysObj.optInt("sun", 0)
                        rec.days.mon = daysObj.optInt("mon", 0)
                        rec.days.tue = daysObj.optInt("tue", 0)
                        rec.days.wed = daysObj.optInt("wed", 0)
                        rec.days.thu = daysObj.optInt("thu", 0)
                    }
                    list.add(rec)
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
        if (list.isEmpty()) {
            val defaultNames = getNames()
            list.add(WageRecord(id = "1", employeeName = defaultNames.getOrNull(0)?.name ?: "سامي القادري"))
            list.add(WageRecord(id = "2", employeeName = defaultNames.getOrNull(1)?.name ?: "أحمد بن محمد"))
            list.add(WageRecord(id = "3", employeeName = defaultNames.getOrNull(2)?.name ?: "علي حسن الشامي"))
        }
        return list
    }

    fun saveCurrentRecords(records: List<WageRecord>) {
        val array = JSONArray()
        for (r in records) {
            val obj = JSONObject()
            obj.put("id", r.id)
            obj.put("employeeName", r.employeeName)
            obj.put("ratePerOp", r.ratePerOp)
            val d = JSONObject()
            d.put("sat", r.days.sat)
            d.put("sun", r.days.sun)
            d.put("mon", r.days.mon)
            d.put("tue", r.days.tue)
            d.put("wed", r.days.wed)
            d.put("thu", r.days.thu)
            obj.put("days", d)
            array.put(obj)
        }
        prefs.edit().putString(KEY_RECORDS, array.toString()).apply()
    }
}

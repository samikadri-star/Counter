package com.sami.archivecalc.models

data class EmployeeName(
    val id: String = System.currentTimeMillis().toString(),
    var name: String = ""
)

data class DayOperations(
    var sat: Int = 0,
    var sun: Int = 0,
    var mon: Int = 0,
    var tue: Int = 0,
    var wed: Int = 0,
    var thu: Int = 0
) {
    fun total(): Int = sat + sun + mon + tue + wed + thu
}

data class WageRecord(
    val id: String = System.currentTimeMillis().toString() + "_" + (100..999).random(),
    var employeeName: String = "",
    val days: DayOperations = DayOperations(),
    var ratePerOp: Int = 17
) {
    fun totalOperations(): Int = days.total()
    fun totalDueAmount(): Int = totalOperations() * ratePerOp
}

data class ArchivedBatch(
    val id: String = "batch_" + System.currentTimeMillis(),
    val title: String,
    val date: String,
    val ratePerOp: Int,
    val records: List<WageRecord>,
    val grandTotalOps: Int,
    val grandTotalAmount: Int
)

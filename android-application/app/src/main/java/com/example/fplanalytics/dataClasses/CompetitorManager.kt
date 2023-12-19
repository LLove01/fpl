package com.example.fplanalytics.dataClasses

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class CompetitorManager(
    @SerialName("name")
    val managerName: String,

    @SerialName("id")
    val id: Int
){}
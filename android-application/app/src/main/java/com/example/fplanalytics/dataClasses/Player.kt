package com.example.fplanalytics.dataClasses

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class Player(
    @SerialName("first_name")
    val firstName: String,

    @SerialName("second_name")
    val secondName: String,

    @SerialName("element_type")
    val elementType: Int
)
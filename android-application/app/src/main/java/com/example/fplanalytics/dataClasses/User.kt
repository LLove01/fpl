package com.example.fplanalytics.dataClasses

import kotlinx.serialization.SerialName

@kotlinx.serialization.Serializable
data class User(
    @SerialName("username")
    var username: String,

    @SerialName("managerId")
    var managerId: String,

    @SerialName("competitors")
    var competitors: MutableList<CompetitorManager>
) {}
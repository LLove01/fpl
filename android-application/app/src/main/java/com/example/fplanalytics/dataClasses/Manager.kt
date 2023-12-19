package com.example.fplanalytics.dataClasses

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class Manager(
    @SerialName("manager_first_name")
    val managerFirstName: String,

    @SerialName("manager_second_name")
    val managerSecondName: String,

    @SerialName("country")
    val country: String,

    @SerialName("favourite_team")
    val favouriteTeam: String,

    @SerialName("current_rank")
    val currentRank: Int,

    @SerialName("total_points")
    val totalPoints: Int,

    @SerialName("players")
    val players: List<Player>
)
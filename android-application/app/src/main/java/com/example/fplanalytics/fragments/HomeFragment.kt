package com.example.fplanalytics.fragments

import android.annotation.SuppressLint
import android.os.Bundle
import android.util.Log
import android.view.View
import androidx.fragment.app.Fragment
import com.example.fplanalytics.MainActivity
import com.example.fplanalytics.MyApplication
import com.example.fplanalytics.R
import com.example.fplanalytics.adapters.PlayerAdapter
import com.example.fplanalytics.dataClasses.Manager
import com.google.android.material.bottomnavigation.BottomNavigationItemView
import com.google.android.material.snackbar.Snackbar
import kotlinx.android.synthetic.main.activity_main.nav_view
import kotlinx.android.synthetic.main.fragment_home.*
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.json.Json
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response


class HomeFragment : Fragment(R.layout.fragment_home) {
    private lateinit var app: MyApplication
    private lateinit var myManager: Manager

    @SuppressLint("SetTextI18n", "NotifyDataSetChanged")
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        app = (activity?.application as MyApplication)

        getData(view, app.user!!.managerId)
    }

    private fun getData(view:View, managerId: String?) {
        CoroutineScope(Dispatchers.IO).launch {
            val call: Call<ResponseBody> = app.fplService.getManagerData(managerId)

            // Asynchronous call
            call.enqueue(object : Callback<ResponseBody> {
                override fun onResponse(call: Call<ResponseBody>, response: Response<ResponseBody>) {
                    if (response.isSuccessful) {
                        var rawJson = response.body()?.string()
                        rawJson = rawJson!!.trimIndent()
                        myManager = Json.decodeFromString<Manager>(rawJson)
                        println(myManager)

                        setTextViewValues()

                        val adapter = PlayerAdapter(myManager.players)
                        recyclerview.adapter = adapter

                        setVisibility()
                    } else {
                        Snackbar.make(
                            view,
                            "FAILED GETTING YOUR MANAGER DATA!",
                            Snackbar.LENGTH_LONG
                        ).show()
                    }
                }

                override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
                    Snackbar.make(
                        view,
                        "FAILED GETTING YOUR MANAGER DATA!",
                        Snackbar.LENGTH_LONG
                    ).show()
                }
            })
        }
    }

    @SuppressLint("SetTextI18n")
    private fun setTextViewValues() {
        textViewManagerName.text = myManager.managerFirstName + " " + myManager.managerSecondName
        textViewNationality.text = myManager.country
        textViewFavouriteTeam.text = myManager.favouriteTeam
        textViewCurrentRank.text = myManager.currentRank.toString()
        textViewTotalPoints.text = myManager.totalPoints.toString()
    }

    private fun setVisibility() {
        textViewManagerName.visibility = View.VISIBLE
        textViewNationality.visibility = View.VISIBLE
        textViewFavouriteTeam.visibility = View.VISIBLE
        textViewCurrentRank.visibility = View.VISIBLE
        textViewTotalPoints.visibility = View.VISIBLE
        textViewManagerNameLabel.visibility = View.VISIBLE
        textViewNationalityLabel.visibility = View.VISIBLE
        textViewFavouriteTeamLabel.visibility = View.VISIBLE
        textViewCurrentRankLabel.visibility = View.VISIBLE
        textViewTotalPointsLabel.visibility = View.VISIBLE
        recyclerview.visibility = View.VISIBLE
        textViewLoading.visibility = View.INVISIBLE
    }
}
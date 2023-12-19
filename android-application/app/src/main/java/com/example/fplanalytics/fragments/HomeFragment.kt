package com.example.fplanalytics.fragments

import android.annotation.SuppressLint
import android.os.Bundle
import android.view.View
import androidx.activity.result.contract.ActivityResultContracts
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import com.example.fplanalytics.MyApplication
import com.example.fplanalytics.R
import com.example.fplanalytics.adapters.PlayerAdapter
import com.example.fplanalytics.dataClasses.Manager
import com.google.android.material.snackbar.Snackbar
import kotlinx.android.synthetic.main.fragment_home.*
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.json.Json
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import timber.log.Timber


class HomeFragment : Fragment(R.layout.fragment_home) {
    private lateinit var app: MyApplication

    @SuppressLint("SetTextI18n", "NotifyDataSetChanged")
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        app = (activity?.application as MyApplication)

        textViewHelloUser.text = getString(R.string.hello_username, app.getUser()?.username ?: "")
        textViewManagerName.text = app.myManager.managerFirstName + " " + app.myManager.managerSecondName
        textViewNationality.text = app.myManager.country
        textViewFavouriteTeam.text = app.myManager.favouriteTeam
        textViewCurrentRank.text = app.myManager.currentRank.toString()
        textViewTotalPoints.text = app.myManager.totalPoints.toString()

        val adapter = PlayerAdapter(app.myManager.players)

        recyclerview.adapter = adapter

        buttonPlayerAnalysis.setOnClickListener {
            Timber.d("Manager id:" + app.getUser()?.managerId)
            println(app.myManager)
            //getData(view, app.getUser()?.managerId)
            //val action = HomeFragmentDirections.actionHomeFragmentToCompetitorTeamFragment()
            //findNavController().navigate(action)
        }

        buttonLogout.setOnClickListener {
            app.logoutUser()

            val action = HomeFragmentDirections.actionHomeFragmentToWelcomeFragment()
            findNavController().navigate(action)
        }
    }

    /*
    private fun getData(view: View, managerId: String?) {
        CoroutineScope(Dispatchers.IO).launch {
            val call: Call<Manager> = app.fplService.generalInfo()

            // Asynchronous call
            call.enqueue(object : Callback<Manager> {
                override fun onResponse(call: Call<Manager>, response: Response<Manager>) {
                    if (response.isSuccessful) {
                        val data: Manager? = response.body()
                        if (data != null) {

                        }
                    } else {
                        Snackbar.make(
                            view,
                            "FAILED GENERAL INFO!",
                            Snackbar.LENGTH_LONG
                        ).show()
                    }
                }

                override fun onFailure(call: Call<Manager>, t: Throwable) {
                    Snackbar.make(
                        view,
                        "FAILED GENERAL INFO!",
                        Snackbar.LENGTH_LONG
                    ).show()
                }
            })
        }
    }
     */

    /*
    private fun extractElements(rawJson: String?): String {
        var result = ""
        if (!rawJson.isNullOrEmpty()) {
            val startIndex = rawJson.indexOf("elements")
            if (startIndex != -1) {
                val endIndex = rawJson.indexOf(']', startIndex)
                if (endIndex != -1) {
                    result = rawJson.substring(startIndex - 1, rawJson.indexOf(']', endIndex) + 1)
                }
            }
        }
        return "{$result}"
    }
     */
}
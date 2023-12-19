/*package com.example.fplanalytics.fragments

import android.os.Bundle
import android.view.View
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import com.example.fplanalytics.MyApplication
import com.example.fplanalytics.R
import com.example.fplanalytics.dataClasses.ElementsResponse
import com.example.fplanalytics.dataClasses.Player
import com.google.android.material.snackbar.Snackbar
import kotlinx.android.synthetic.main.fragment_home.*
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import timber.log.Timber

class CompetitorTeamFragment : Fragment(R.layout.fragment_competitor_team) {
    private lateinit var app: MyApplication

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        app = (activity?.application as MyApplication)

        textViewHelloUser.text = getString(R.string.hello_username, app.getUser()?.username ?: "")

        buttonPlayerAnalysis.setOnClickListener {
            getData(view)
        }

        buttonLogout.setOnClickListener {
            app.logoutUser()

            val action = HomeFragmentDirections.actionHomeFragmentToWelcomeFragment()
            findNavController().navigate(action)
        }
    }

    private fun getData(view: View) {
        CoroutineScope(Dispatchers.IO).launch {
            //try {
            val call: Call<ElementsResponse> = app.fplService.generalInfo()

            // Asynchronous call
            call.enqueue(object : Callback<ElementsResponse> {
                override fun onResponse(
                    call: Call<ElementsResponse>,
                    response: Response<ElementsResponse>
                ) {
                    if (response.isSuccessful) {
                        val data: ElementsResponse? = response.body()
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

                override fun onFailure(call: Call<ElementsResponse>, t: Throwable) {
                    Snackbar.make(
                        view,
                        "FAILED GENERAL INFO!",
                        Snackbar.LENGTH_LONG
                    ).show()
                }
            })
        }
    }
}*/
package com.example.fplanalytics.fragments

import android.os.Bundle
import android.view.View
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import com.example.fplanalytics.MyApplication
import com.example.fplanalytics.R
import com.google.android.material.snackbar.Snackbar
import kotlinx.android.synthetic.main.fragment_home.*
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import timber.log.Timber

class HomeFragment : Fragment(R.layout.fragment_home) {
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
            val call: Call<Map<String, Any>> = app.fplService.generalInfo()

            // Asynchronous call
            call.enqueue(object : Callback<Map<String, Any>> {
                override fun onResponse(call: Call<Map<String, Any>>, response: Response<Map<String, Any>>) {
                    if (response.isSuccessful) {
                        val data: Map<String, Any>? = response.body()
                        if (data != null) {
                            Timber.d(data["events"].toString())
                        }
                    } else {
                        Snackbar.make(
                            view,
                            "FAILED GENERAL INFO!",
                            Snackbar.LENGTH_LONG
                        ).show()
                    }
                }

                override fun onFailure(call: Call<Map<String, Any>>, t: Throwable) {
                    Snackbar.make(
                        view,
                        "FAILED GENERAL INFO!",
                        Snackbar.LENGTH_LONG
                    ).show()
                }
            })
            /*withContext(Dispatchers.Main) {
                if (responseFromServer.isSuccessful) {
                    // Convert raw JSON to pretty JSON using GSON library
                    val gson = app.getGsonInstance()
                    val prettyJson = gson.toJson(
                        JsonParser.parseString(
                            responseFromServer.body()
                                ?.string()
                        )
                    )
                    val jsonObject: JSONObject = JSONObject(prettyJson)
                    // get user's data from json and save it in object
                    app.saveUser(
                        User(
                            jsonObject.getString("username"),
                            jsonObject.getString("managerId")
                        )
                    )

                    // navigate to home fragment
                    val action =
                        LoginFragmentDirections.actionLoginFragmentToHomeFragment()

                    findNavController().navigate(action)
                    return@withContext
                } else {
                    // show snackbar with warning that login was NOT successful
                    Snackbar.make(
                        view,
                        "Wrong username or password",
                        Snackbar.LENGTH_LONG
                    ).show()
                }
            }
        } catch (exception: Exception) {
            when (exception) {
                is ConnectException -> {
                    // show snackbar with warning that sending data was NOT successful
                    Snackbar.make(
                        view,
                        "Can not connect to server",
                        Snackbar.LENGTH_LONG
                    ).show()
                }
                is UnknownHostException -> {
                    // show snackbar with warning that sending data was NOT successful
                    Snackbar.make(
                        view,
                        "Can not connect to server",
                        Snackbar.LENGTH_LONG
                    ).show()
                }
            }
        }*/
        }
    }
}
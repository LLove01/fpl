package com.example.fplanalytics.fragments

import android.os.Bundle
import android.view.View
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import com.example.fplanalytics.MyApplication
import com.example.fplanalytics.R
import com.example.fplanalytics.dataClasses.User
import com.google.android.material.snackbar.Snackbar
import com.google.gson.JsonParser
import kotlinx.android.synthetic.main.fragment_register.*
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject
import java.net.ConnectException
import java.net.UnknownHostException

class RegisterFragment : Fragment(R.layout.fragment_register) {
    private lateinit var app: MyApplication

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        app = (activity?.application as MyApplication)

        buttonRegister.setOnClickListener {
            if (isFormCompleted()) {
                register(view)
            }
        }
    }

    private fun register(view: View) {
        // Create JSON using JSONObject
        val jsonObjectToSend = JSONObject()
        jsonObjectToSend.put("username", editTextUserName.text)
        jsonObjectToSend.put("password", editTextUserPassword.text)
        jsonObjectToSend.put("managerId", editTextManagerId.text)

        // Convert JSONObject to String
        val jsonObjectStringToSend = jsonObjectToSend.toString()

        // Create RequestBody
        val requestBody =
            jsonObjectStringToSend.toRequestBody("application/json".toMediaTypeOrNull())

        CoroutineScope(Dispatchers.IO).launch {
            try {
                // Do the POST request and get response
                val responseFromServer = app.dbService.register(requestBody)

                withContext(Dispatchers.Main) {
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

                        // show snackbar with message that register was successful
                        Snackbar.make(
                            view,
                            "You are now registered. Yeey",
                            Snackbar.LENGTH_LONG
                        ).show()


                        // navigate to home fragment
                        val action =
                            RegisterFragmentDirections.actionRegisterFragmentToLoginFragment()
                        findNavController().navigate(action)
                        return@withContext
                    } else {
                        // show snackbar with warning that login was NOT successful
                        Snackbar.make(
                            view,
                            "Something went wrong",
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
            }
        }
    }

    // are all fields in form completed
    private fun isFormCompleted(): Boolean {
        var completed = true
        // if editText is empty or has spaces set error message
        if (editTextManagerId.text.toString().isBlank()) {
            editTextManagerId.error = getString(R.string.requiredField)
            completed = false
        }

        // if editText is empty or has spaces set error message
        if (editTextUserName.text.toString().isBlank()) {
            editTextUserName.error = getString(R.string.requiredField)
            completed = false
        }

        // if editTexts do not match set error message
        if (editTextUserPassword.text.toString() != editTextUserPasswordRepeat.text.toString()
        ) {
            editTextUserPasswordRepeat.error = getString(R.string.passwords_do_not_match)
            completed = false
        }

        // if editText is empty or has spaces set error message
        if (editTextUserPassword.text.toString().isBlank()) {
            editTextUserPassword.error = getString(R.string.requiredField)
            completed = false
        }

        // if editText is empty or has spaces set error message
        if (editTextUserPasswordRepeat.text.toString().isBlank()) {
            editTextUserPasswordRepeat.error = getString(R.string.requiredField)
            completed = false
        }

        return completed
    }

}
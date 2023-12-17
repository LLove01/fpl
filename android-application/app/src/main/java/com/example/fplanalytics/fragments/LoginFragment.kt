package com.example.fplanalytics.fragments

import android.content.Context
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.View
import android.view.inputmethod.InputMethodManager
import android.widget.Button
import android.widget.EditText
import androidx.navigation.fragment.findNavController
import com.example.fplanalytics.MyApplication
import com.example.fplanalytics.R
import com.example.fplanalytics.dataClasses.User
import com.google.android.material.snackbar.Snackbar
import com.google.gson.JsonParser
import kotlinx.android.synthetic.main.fragment_login.*
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject
import java.net.ConnectException
import java.net.UnknownHostException

class LoginFragment : Fragment(R.layout.fragment_login) {
    private lateinit var app: MyApplication

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        app = (activity?.application as MyApplication)

        buttonLogin.setOnClickListener {
            // hide keyboard
            hideSoftKeyboard(view)
            // when everything in form is completed try login user
            if (isFormCompleted()) {
                // try login user
                login(view)
            }
        }
    }

    private fun login(view: View) {
        // Create JSON using JSONObject
        val jsonObjectToSend = JSONObject()
        jsonObjectToSend.put("username", editTextUserName.text)
        jsonObjectToSend.put("password", editTextUserPassword.text)

        // Convert JSONObject to String
        val jsonObjectStringToSend = jsonObjectToSend.toString()

        // Create RequestBody
        val requestBody =
            jsonObjectStringToSend.toRequestBody("application/json".toMediaTypeOrNull())

        CoroutineScope(Dispatchers.IO).launch {
            try {
                // Do the POST request and get response
                val responseFromServer = app.dbService.login(requestBody)
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
            }
        }
    }

    // are all fields in form completed
    private fun isFormCompleted(): Boolean {
        var completed = true

        // if editText is empty or has spaces set error message
        if (editTextUserName.text.toString().isBlank()) {
            editTextUserName.error = getString(R.string.requiredField)
            completed = false
        }

        // if editText is empty or has spaces set error message
        if (editTextUserPassword.text.toString().isBlank()) {
            editTextUserPassword.error = getString(R.string.requiredField)
            completed = false
        }

        return completed
    }

    // hide keyboard
    private fun hideSoftKeyboard(view: View) {
        val imm =
            context?.getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager
        imm.hideSoftInputFromWindow(view.windowToken, 0)
    }
}
package com.example.fplanalytics.fragments

import android.os.Bundle
import android.view.View
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import com.example.fplanalytics.MyApplication
import com.example.fplanalytics.R
import kotlinx.android.synthetic.main.fragment_welcome.*

class WelcomeFragment : Fragment(R.layout.fragment_welcome) {
    private lateinit var app: MyApplication

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        app = (activity?.application as MyApplication)

        // check if user is logged in if so move to Home fragment
        //TODO: če je user že logginan dodaj naj te kar na home fragment doda (main fragment)
        /*if (app.isUserLoggedIn()) {
            val action = WelcomeFragmentDirections.actionWelcomeFragmentToHomeFragment()
            findNavController().navigate(action)
            return
        }*/

        buttonSignIn.setOnClickListener {
            // move to login fragment
            val action = WelcomeFragmentDirections.actionWelcomeFragmentToLoginFragment()
            findNavController().navigate(action)
        }

        buttonSignUp.setOnClickListener {
            // move to register fragment
            val action = WelcomeFragmentDirections.actionWelcomeFragmentToRegisterFragment()
            findNavController().navigate(action)
        }
    }
}
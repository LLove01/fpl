package com.example.fplanalytics.fragments

import android.annotation.SuppressLint
import android.os.Bundle
import android.view.View
import android.widget.AdapterView
import android.widget.ArrayAdapter
import android.widget.Spinner
import androidx.fragment.app.Fragment
import com.example.fplanalytics.MyApplication
import com.example.fplanalytics.R
import com.example.fplanalytics.adapters.PlayerAdapter
import com.example.fplanalytics.dataClasses.CompetitorManager
import com.example.fplanalytics.dataClasses.Manager
import com.google.android.material.snackbar.Snackbar
import kotlinx.android.synthetic.main.fragment_competitor_team.buttonAdd
import kotlinx.android.synthetic.main.fragment_competitor_team.managerIdInput
import kotlinx.android.synthetic.main.fragment_competitor_team.recyclerview2
import kotlinx.android.synthetic.main.fragment_competitor_team.spinner
import kotlinx.android.synthetic.main.fragment_competitor_team.textViewCurrentRank2
import kotlinx.android.synthetic.main.fragment_competitor_team.textViewCurrentRankLabel2
import kotlinx.android.synthetic.main.fragment_competitor_team.textViewFavouriteTeam2
import kotlinx.android.synthetic.main.fragment_competitor_team.textViewFavouriteTeamLabel2
import kotlinx.android.synthetic.main.fragment_competitor_team.textViewManagerName2
import kotlinx.android.synthetic.main.fragment_competitor_team.textViewManagerNameLabel2
import kotlinx.android.synthetic.main.fragment_competitor_team.textViewNationality2
import kotlinx.android.synthetic.main.fragment_competitor_team.textViewNationalityLabel2
import kotlinx.android.synthetic.main.fragment_competitor_team.textViewTotalPoints2
import kotlinx.android.synthetic.main.fragment_competitor_team.textViewTotalPointsLabel2
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.json.Json
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class CompetitorTeamFragment : Fragment(R.layout.fragment_competitor_team) {
    private lateinit var app: MyApplication
    private var competitorFullManager: Manager = Manager("", "", "", "", 0, 0, listOf())

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        app = (activity?.application as MyApplication)

        // Array of competitors
        val competitorsManagerList = app.user?.competitors

        if (competitorsManagerList!!.isNotEmpty()) {
            // If we already have competitors in list
            addSpinnerAndEvents(view, competitorsManagerList)
        } else {
            // If we don't have any competitors in list
            buttonAdd.setOnClickListener {
                if (managerIdInput.text.isNotEmpty()) {
                    val managerId = managerIdInput.text.toString().toInt()
                    app.user?.competitors?.add(CompetitorManager("ime$managerId", managerId))
                    addSpinnerAndEvents(view, competitorsManagerList)
                } else {
                    Snackbar.make(
                        view,
                        "Please insert competitor id!",
                        Snackbar.LENGTH_LONG
                    ).show()
                }
            }
        }
    }

    private fun addSpinnerAndEvents(
        view: View,
        competitorsManagerList: MutableList<CompetitorManager>
    ) {
        val spinner: Spinner = spinner

        // Extract names from CompetitorsManagerList and create a list of names
        // We need to do this because adapter for spinner need MutableList<String> instead of MutableList<CompetitorManager>
        val competitorNames: MutableList<String> =
            competitorsManagerList.map { it.managerName } as MutableList<String>

        // Create an ArrayAdapter using the defined array
        val adapter: ArrayAdapter<String> = ArrayAdapter(
            requireContext(),
            android.R.layout.simple_spinner_item,
            competitorNames
        )

        // Set dropdown layout style
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)

        // Set the adapter to the spinner
        spinner.adapter = adapter

        // Add item selected listener to the spinner
        spinner.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
            override fun onItemSelected(
                parent: AdapterView<*>?,
                view2: View?,
                position: Int,
                id: Long
            ) {
                // When item is selected we need to get the managerId from the bigger list
                val selectedItemManagerId: Int = competitorsManagerList[position].id
                getDataAndSetVisibilityAfterRecivingIt(view, selectedItemManagerId.toString())
            }

            override fun onNothingSelected(parent: AdapterView<*>?) {
                // Do something when nothing is selected
            }
        }

        // We have different event if we already have something in the list
        buttonAdd.setOnClickListener {
            if (managerIdInput.text.isNotEmpty()) {
                val managerId = managerIdInput.text.toString().toInt()
                println(managerId)
                app.user?.competitors?.add(CompetitorManager("ime$managerId", managerId))
                competitorNames.add("ime$managerId")
                adapter.notifyDataSetChanged()
            } else {
                Snackbar.make(
                    view,
                    "Please insert competitor id!",
                    Snackbar.LENGTH_LONG
                ).show()
            }
        }
    }

    private fun getDataAndSetVisibilityAfterRecivingIt(view: View, managerId: String?) {
        CoroutineScope(Dispatchers.IO).launch {
            val call: Call<ResponseBody> = app.fplService.getManagerData(managerId)

            // Asynchronous call
            call.enqueue(object : Callback<ResponseBody> {
                override fun onResponse(
                    call: Call<ResponseBody>,
                    response: Response<ResponseBody>
                ) {
                    if (response.isSuccessful) {
                        var rawJson = response.body()?.string()
                        rawJson = rawJson!!.trimIndent()
                        competitorFullManager = Json.decodeFromString<Manager>(rawJson)
                        println(competitorFullManager)

                        setTextViewValues()

                        val adapter = PlayerAdapter(competitorFullManager.players)
                        recyclerview2.adapter = adapter

                        setVisibility()
                    } else {
                        Snackbar.make(
                            view,
                            "FAILED GENERAL INFO!",
                            Snackbar.LENGTH_LONG
                        ).show()
                    }
                }

                override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
                    Snackbar.make(
                        view,
                        "FAILED GENERAL INFO!",
                        Snackbar.LENGTH_LONG
                    ).show()
                }
            })
        }
    }

    @SuppressLint("SetTextI18n")
    private fun setTextViewValues() {
        textViewManagerName2.text =
            competitorFullManager.managerFirstName + " " + competitorFullManager.managerSecondName
        textViewNationality2.text = competitorFullManager.country
        textViewFavouriteTeam2.text = competitorFullManager.favouriteTeam
        textViewCurrentRank2.text = competitorFullManager.currentRank.toString()
        textViewTotalPoints2.text = competitorFullManager.totalPoints.toString()
    }

    private fun setVisibility() {
        textViewManagerName2.visibility = View.VISIBLE
        textViewNationality2.visibility = View.VISIBLE
        textViewFavouriteTeam2.visibility = View.VISIBLE
        textViewCurrentRank2.visibility = View.VISIBLE
        textViewTotalPoints2.visibility = View.VISIBLE
        textViewManagerNameLabel2.visibility = View.VISIBLE
        textViewNationalityLabel2.visibility = View.VISIBLE
        textViewFavouriteTeamLabel2.visibility = View.VISIBLE
        textViewCurrentRankLabel2.visibility = View.VISIBLE
        textViewTotalPointsLabel2.visibility = View.VISIBLE
        spinner.visibility = View.VISIBLE
        recyclerview2.visibility = View.VISIBLE
    }
}
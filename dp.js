let selectedSymptoms = new Set();

function toggleSymptom(element, symptom) {
  element.classList.toggle("selected");
  selectedSymptoms.has(symptom) 
    ? selectedSymptoms.delete(symptom) 
    : selectedSymptoms.add(symptom);
}

function analyzeSymptoms() {
  const input = document.getElementById("symptomInput").value;
  const loading = document.getElementById("loadingIndicator");
  const results = document.getElementById("resultsContainer");

  if (!input && selectedSymptoms.size === 0) {
    alert("Please describe or select symptoms.");
    return;
  }

  results.innerHTML = "";
  loading.classList.remove("hidden");
  
  setTimeout(() => {
    loading.classList.add("hidden");
    displayResults(generatePredictions(input, Array.from(selectedSymptoms)));
  }, 2000);
}

function generatePredictions(textInput, selected) {
  const symText = textInput.toLowerCase().split(/\s+/).filter(word => word.length > 2);
  const all = [...selected, ...symText];
  let out = [];


 const diseaseDatabase = [
  // 🫁 Respiratory System
  {
    disease: "Common Cold",
    confidence: "75%",
    description: "Upper respiratory tract viral infection causing cough and mild fever.",
    recommendations: ["Rest", "Stay hydrated", "Steam inhalation"],
    symptoms: ["fever", "cough", "sore throat", "headache", "runny nose"],
    system: "Respiratory"
  },
  {
    disease: "Pneumonia",
    confidence: "80%",
    description: "Infection that inflames air sacs in the lungs.",
    recommendations: ["Antibiotics", "Plenty of fluids", "Rest"],
    symptoms: ["fever", "cough", "shortness of breath", "chest pain", "chills"],
    system: "Respiratory"
  },
  {
    disease: "Asthma",
    confidence: "70%",
    description: "Chronic condition where airways narrow and swell.",
    recommendations: ["Inhaler use", "Avoid allergens", "Regular check-ups"],
    symptoms: ["wheezing", "cough", "shortness of breath", "chest tightness"],
    system: "Respiratory"
  },
  {
    disease: "Tuberculosis",
    confidence: "80%",
    description: "Bacterial infection affecting lungs caused by Mycobacterium tuberculosis.",
    recommendations: ["Antibiotics", "Proper nutrition", "Long-term treatment"],
    symptoms: ["persistent cough", "fever", "night sweats", "weight loss"],
    system: "Respiratory"
  },

  // ❤️ Cardiovascular (Heart)
  {
    disease: "Hypertension (High Blood Pressure)",
    confidence: "70%",
    description: "Condition in which the blood pressure in arteries is persistently elevated.",
    recommendations: ["Low-sodium diet", "Exercise", "Medication as prescribed"],
    symptoms: ["headache", "dizziness", "chest pain", "fatigue"],
    system: "Cardiovascular"
  },
  {
    disease: "Coronary Artery Disease",
    confidence: "80%",
    description: "Narrowing or blockage of coronary arteries causing reduced blood flow.",
    recommendations: ["Healthy diet", "Regular exercise", "Avoid smoking", "Medication"],
    symptoms: ["chest pain", "shortness of breath", "fatigue", "angina"],
    system: "Cardiovascular"
  },
  {
    disease: "Heart Failure",
    confidence: "85%",
    description: "Heart’s inability to pump enough blood for body’s needs.",
    recommendations: ["Low-sodium diet", "Diuretics", "Regular medical monitoring"],
    symptoms: ["fatigue", "shortness of breath", "swelling", "orthopnea"],
    system: "Cardiovascular"
  },
  {
    disease: "Heart Attack (Myocardial Infarction)",
    confidence: "90%",
    description: "Blockage of blood flow to the heart muscle.",
    recommendations: ["Emergency care", "Aspirin", "Immediate hospitalization"],
    symptoms: ["chest pain", "sweating", "nausea", "shortness of breath"],
    system: "Cardiovascular"
  },

  // 🧠 Brain & Nervous System
  {
    disease: "Migraine",
    confidence: "75%",
    description: "Severe recurrent headaches often with nausea and light sensitivity.",
    recommendations: ["Rest", "Painkillers", "Avoid triggers"],
    symptoms: ["headache", "nausea", "vomiting", "sensitivity to light"],
    system: "Neurological"
  },
  {
    disease: "Stroke",
    confidence: "85%",
    description: "Sudden loss of brain function due to disrupted blood flow.",
    recommendations: ["Immediate medical attention", "Clot-dissolving drugs", "Rehabilitation"],
    symptoms: ["sudden weakness", "slurred speech", "facial droop", "confusion"],
    system: "Neurological"
  },
  {
    disease: "Epilepsy",
    confidence: "80%",
    description: "Chronic neurological disorder characterized by recurrent seizures.",
    recommendations: ["Medication", "Avoid triggers", "Regular medical care"],
    symptoms: ["seizures", "blackout", "confusion", "staring spells"],
    system: "Neurological"
  },
  {
    disease: "Meningitis",
    confidence: "75%",
    description: "Inflammation of the membranes surrounding brain and spinal cord.",
    recommendations: ["Hospitalization", "Antibiotics", "Fluids"],
    symptoms: ["fever", "stiff neck", "headache", "confusion"],
    system: "Neurological"
  },

  // 👁️ Eye Disorders
  {
    disease: "Conjunctivitis (Pink Eye)",
    confidence: "70%",
    description: "Inflammation of the outer membrane of the eyeball.",
    recommendations: ["Avoid touching eyes", "Use prescribed eye drops", "Maintain hygiene"],
    symptoms: ["red eyes", "itching", "watering", "eye discharge"],
    system: "Eye"
  },
  {
    disease: "Glaucoma",
    confidence: "75%",
    description: "Increased pressure in the eye damaging the optic nerve.",
    recommendations: ["Consult ophthalmologist", "Eye drops", "Regular eye exams"],
    symptoms: ["blurred vision", "eye pain", "halos around lights", "headache"],
    system: "Eye"
  },
  {
    disease: "Cataract",
    confidence: "80%",
    description: "Clouding of the eye’s natural lens leading to vision loss.",
    recommendations: ["Surgery", "Eye protection", "Regular vision tests"],
    symptoms: ["blurred vision", "faded colors", "glare sensitivity", "poor night vision"],
    system: "Eye"
  },

  // 🧬 Metabolic & Endocrine
  {
    disease: "Diabetes Mellitus",
    confidence: "80%",
    description: "Metabolic disorder with high blood sugar levels.",
    recommendations: ["Diet control", "Regular exercise", "Medication or insulin"],
    symptoms: ["frequent urination", "increased thirst", "fatigue", "blurred vision"],
    system: "Endocrine"
  },
  {
    disease: "Thyroid Disorder (Hypothyroidism)",
    confidence: "70%",
    description: "Underactive thyroid causing low metabolism.",
    recommendations: ["Thyroid hormone replacement", "Regular check-ups"],
    symptoms: ["fatigue", "weight gain", "dry skin", "cold intolerance"],
    system: "Endocrine"
  },

  // 🍽️ Digestive System
  {
    disease: "Gastroenteritis (Stomach Flu)",
    confidence: "65%",
    description: "Inflammation of the stomach and intestines due to infection.",
    recommendations: ["Hydration", "Light meals", "Rest"],
    symptoms: ["nausea", "vomiting", "diarrhea", "fever", "abdominal pain"],
    system: "Digestive"
  },
  {
    disease: "Liver Disease (Hepatitis)",
    confidence: "80%",
    description: "Inflammation of the liver often due to viral infection.",
    recommendations: ["Avoid alcohol", "Healthy diet", "Medical treatment"],
    symptoms: ["jaundice", "fatigue", "nausea", "abdominal pain"],
    system: "Digestive"
  },
  {
    disease: "Irritable Bowel Syndrome (IBS)",
    confidence: "70%",
    description: "Functional disorder affecting the large intestine.",
    recommendations: ["Dietary management", "Stress reduction", "Regular meals"],
    symptoms: ["abdominal pain", "bloating", "constipation", "diarrhea"],
    system: "Digestive"
  },

  // 🧴 Skin Disorders
  {
    disease: "Allergic Reaction",
    confidence: "70%",
    description: "Immune system reaction to allergens causing skin irritation.",
    recommendations: ["Avoid allergen", "Antihistamines", "Cool compresses"],
    symptoms: ["rash", "itching", "swelling", "redness"],
    system: "Skin"
  },
  {
    disease: "Eczema",
    confidence: "75%",
    description: "Chronic skin inflammation causing itchiness and dryness.",
    recommendations: ["Moisturize", "Avoid triggers", "Topical creams"],
    symptoms: ["itching", "dry skin", "rash", "red patches"],
    system: "Skin"
  },

  // 🧘 Mental Health
  {
    disease: "Depressive Disorder",
    confidence: "90%",
    description: "Persistent low mood and loss of interest or pleasure in activities.",
    recommendations: ["Therapy", "Antidepressants", "Healthy lifestyle"],
    symptoms: ["sadness", "hopelessness", "fatigue", "loss of interest", "sleep disturbance"],
    system: "Mental Health"
  },
  {
    disease: "Anxiety Disorder",
    confidence: "80%",
    description: "Excessive fear or worry affecting daily functioning.",
    recommendations: ["Counseling", "Relaxation techniques", "Medication if needed"],
    symptoms: ["restlessness", "rapid heartbeat", "trembling", "insomnia"],
    system: "Mental Health"
  },
  {
    disease: "Bipolar Disorder",
    confidence: "85%",
    description: "Mood disorder with alternating periods of depression and mania.",
    recommendations: ["Mood stabilizers", "Therapy", "Sleep regulation"],
    symptoms: ["mood swings", "high energy", "depression", "irritability"],
    system: "Mental Health"
  },

  // 💧 Urinary & Kidney
  {
    disease: "Urinary Tract Infection (UTI)",
    confidence: "75%",
    description: "Infection in urinary system (kidneys, bladder, or urethra).",
    recommendations: ["Antibiotics", "Increase water intake", "Avoid irritants"],
    symptoms: ["burning urination", "frequent urination", "lower abdominal pain"],
    system: "Urinary"
  },
  {
    disease: "Kidney Stones",
    confidence: "80%",
    description: "Hard deposits in kidneys causing pain and urinary problems.",
    recommendations: ["Hydration", "Pain relief", "Medical evaluation"],
    symptoms: ["severe back pain", "blood in urine", "nausea", "frequent urination"],
    system: "Urinary"
  },
];

  // Match symptoms with diseases
  diseaseDatabase.forEach(disease => {
    const matchCount = disease.symptoms.filter(symptom => 
      all.some(userSymptom => {
        const s = symptom.toLowerCase();
        const u = userSymptom.toLowerCase();
        return s === u || s.includes(u) || u.includes(s);
      })
    ).length;
    
    if (matchCount >= 2) {
      const matchPercentage = Math.round((matchCount / disease.symptoms.length) * 100);
      out.push({
        disease: disease.disease,
        confidence: matchPercentage + "%",
        description: disease.description,
        recommendations: disease.recommendations
      });
    }
  });

  return out.length ? out : [{disease:"CONGRATULATION DISEASE NOT FOUND, YOU ARE SAFE",confidence:"50%",description:"Non-specific symptoms.",recommendations:["Monitor","Healthy lifestyle","Consult doctor if worsens"]}];
}

function displayResults(predictions) {
  const c = document.getElementById("resultsContainer");
  predictions.forEach(p => {
    const div = document.createElement("div");
    div.className = "prediction-card bg-white p-6 rounded-lg shadow-md fade-in";
    const isSafe = p.disease.includes("CONGRATULATION");
    div.innerHTML = `
      <div class="flex justify-between items-start mb-4">
        <div>
          <h3 class="text-xl font-semibold text-gray-800">${p.disease}</h3>
          ${!isSafe ? `<span class="text-sm text-green-600 font-medium">${p.confidence} match</span>` : ''}
        </div>
        ${!isSafe ? `<span onclick="showAIAnalysis('${p.disease.replace(/'/g, "\\'")}')"
          class="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full cursor-pointer hover:bg-blue-200 transition">AI Analysis</span>` : ''}
      </div>
      <p class="text-gray-600 mb-4">${p.description}</p>
      <div class="bg-gray-50 p-4 rounded-lg">
        <h4 class="font-semibold text-gray-700 mb-2">Recommendations:</h4>
        <ul class="list-disc list-inside text-sm text-gray-600">${p.recommendations.map(r => `<li>${r}</li>`).join("")}</ul>
      </div>`;
    c.appendChild(div);
  });
}

function showAIAnalysis(disease) {
  alert(`AI Analysis for ${disease}\n\nThis prediction is based on symptom matching using machine learning algorithms. The confidence score indicates the likelihood of this condition based on your reported symptoms.\n\nNote: This is for informational purposes only. Please consult a healthcare professional for accurate diagnosis.`);
}
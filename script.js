let role = "";
let current = "home";
let previous = "lansia";
let lastText = "";


/* =========================
   NAVIGASI
========================= */

function show(id){

    document
        .querySelectorAll(".screen")
        .forEach(screen => {
            screen.classList.remove("active");
        });

    const target = document.getElementById(id);

    if(target){

        target.classList.add("active");

        current = id;

        window.scrollTo({
            top:0,
            behavior:"smooth"
        });
    }
}


function login(type){

    role = type;

    if(type === "lansia"){

        show("lansia");

        say(
            "Selamat datang. Silakan pilih kebutuhan Anda."
        );
    }

    if(type === "keluarga"){

        show("keluarga");

        say(
            "Selamat datang di halaman keluarga."
        );
    }

    if(type === "petugas"){

        show("petugas");

        say(
            "Selamat datang di halaman petugas."
        );
    }
}


function page(id){

    previous = current;

    show(id);
}


function back(){

    show(previous);
}


function home(){

    role = "";

    show("home");
}


/* =========================
   SUARA
========================= */

function say(text){

    lastText = text;

    document.getElementById(
        "voiceText"
    ).innerText = text;

    document.getElementById(
        "voice"
    ).classList.add("show");

    if("speechSynthesis" in window){

        speechSynthesis.cancel();

        const voice =
            new SpeechSynthesisUtterance(text);

        voice.lang = "id-ID";
        voice.rate = 0.9;
        voice.pitch = 1;

        speechSynthesis.speak(voice);
    }
}


function repeatVoice(){

    if(lastText){

        say(lastText);
    }
}


function closeVoice(){

    document
        .getElementById("voice")
        .classList.remove("show");

    if("speechSynthesis" in window){

        speechSynthesis.cancel();
    }
}


/* =========================
   AKSESIBILITAS
========================= */

function toggleBig(){

    document.body.classList.toggle("big");

    const active =
        document.body.classList.contains("big");

    localStorage.setItem(
        "big",
        active
    );

    say(
        active
        ? "Tulisan diperbesar."
        : "Tulisan dikembalikan."
    );
}


function toggleContrast(){

    document.body.classList.toggle("contrast");

    const active =
        document.body.classList.contains("contrast");

    localStorage.setItem(
        "contrast",
        active
    );

    say(
        active
        ? "Kontras tinggi aktif."
        : "Kontras tinggi dimatikan."
    );
}


/* =========================
   OBAT
========================= */

function medicineDone(){

    localStorage.setItem(
        "medicine",
        "Sudah minum"
    );

    const status =
        document.getElementById(
            "medicineStatus"
        );

    const familyStatus =
        document.getElementById(
            "familyMedicine"
        );

    if(status){
        status.innerText = "Sudah minum";
    }

    if(familyStatus){
        familyStatus.innerText = "Sudah minum";
    }

    say(
        "Status obat sudah dicatat sebagai sudah minum."
    );
}


/* =========================
   KELUARGA
========================= */

function saveFamily(){

    const input =
        document.getElementById(
            "familyInput"
        );

    const number =
        input.value.trim();

    if(!number){

        say(
            "Silakan masukkan nomor keluarga."
        );

        return;
    }

    localStorage.setItem(
        "family",
        number
    );

    document.getElementById(
        "familyNumber"
    ).innerText = number;

    say(
        "Nomor keluarga berhasil disimpan."
    );
}


function callFamily(){

    const number =
        localStorage.getItem(
            "family"
        );

    if(!number){

        say(
            "Nomor keluarga belum diatur."
        );

        return;
    }

    window.location.href =
        "tel:" + number;
}


/* =========================
   DATA LANSIA
========================= */

function saveElder(){

    const name =
        document
            .getElementById("elderName")
            .value
            .trim();

    const birth =
        document
            .getElementById("elderBirth")
            .value;

    const note =
        document
            .getElementById("elderNote")
            .value
            .trim();

    if(!name){

        say(
            "Nama lansia belum diisi."
        );

        return;
    }

    const data = {
        name:name,
        birth:birth,
        note:note
    };

    localStorage.setItem(
        "elder",
        JSON.stringify(data)
    );

    const patient =
        document.getElementById(
            "patientName"
        );

    if(patient){

        patient.innerText = name;
    }

    document.getElementById(
        "elderResult"
    ).innerHTML =
        '<div class="status">✅ Data berhasil disimpan.</div>';

    say(
        "Data lansia berhasil disimpan."
    );
}


/* =========================
   LOKASI
========================= */

function findLocation(){

    const result =
        document.getElementById(
            "locationResult"
        );

    if(!navigator.geolocation){

        result.innerHTML =
            '<div class="status warning">Lokasi tidak didukung browser.</div>';

        return;
    }

    result.innerHTML =
        '<div class="status">📍 Mencari lokasi...</div>';

    navigator.geolocation.getCurrentPosition(

        function(position){

            const lat =
                position.coords.latitude;

            const lon =
                position.coords.longitude;

            result.innerHTML = `

                <div class="card">

                    <h3>📍 Lokasi ditemukan</h3>

                    <p class="line">

                        Latitude:
                        ${lat.toFixed(5)}

                        <br>

                        Longitude:
                        ${lon.toFixed(5)}

                    </p>

                    <button
                        class="primary"
                        onclick="openMap(${lat},${lon})">

                        🗺️ BUKA PETA

                    </button>

                </div>

            `;

            say(
                "Lokasi berhasil ditemukan."
            );
        },

        function(){

            result.innerHTML =
                '<div class="status warning">⚠️ Izin lokasi belum diberikan.</div>';

            say(
                "Izin lokasi belum diberikan."
            );
        }
    );
}


function openMap(lat,lon){

    window.open(

        "https://www.google.com/maps/search/?api=1&query="
        + lat + "," + lon,

        "_blank"
    );
}


/* =========================
   DARURAT
========================= */

function emergency(){

    document
        .getElementById("modal")
        .classList.add("show");
}


function closeEmergency(){

    document
        .getElementById("modal")
        .classList.remove("show");
}


function callEmergency(){

    /*
       Nomor darurat harus diverifikasi
       sesuai wilayah dan layanan resmi
       sebelum digunakan dalam produksi.
    */

    window.location.href =
        "tel:112";
}


/* =========================
   LOAD DATA
========================= */

window.addEventListener(
    "load",
    function(){

        /* Huruf besar */

        if(
            localStorage.getItem("big")
            === "true"
        ){

            document.body
                .classList.add("big");
        }


        /* Kontras */

        if(
            localStorage.getItem("contrast")
            === "true"
        ){

            document.body
                .classList.add("contrast");
        }


        /* Nomor keluarga */

        const family =
            localStorage.getItem(
                "family"
            );

        if(family){

            const number =
                document.getElementById(
                    "familyNumber"
                );

            const input =
                document.getElementById(
                    "familyInput"
                );

            if(number){
                number.innerText = family;
            }

            if(input){
                input.value = family;
            }
        }


        /* Status obat */

        const medicine =
            localStorage.getItem(
                "medicine"
            );

        if(medicine){

            const status =
                document.getElementById(
                    "medicineStatus"
                );

            const familyStatus =
                document.getElementById(
                    "familyMedicine"
                );

            if(status){
                status.innerText = medicine;
            }

            if(familyStatus){
                familyStatus.innerText = medicine;
            }
        }


        /* Data lansia */

        const elder =
            localStorage.getItem(
                "elder"
            );

        if(elder){

            try{

                const data =
                    JSON.parse(elder);

                const patient =
                    document.getElementById(
                        "patientName"
                    );

                if(patient){

                    patient.innerText =
                        data.name || "Belum ada";
                }

            }catch(error){

                console.log(
                    "Data lansia tidak dapat dibaca."
                );
            }
        }

    }
);
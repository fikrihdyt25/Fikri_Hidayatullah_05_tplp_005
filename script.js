

// Fungsi untuk mengambil data karyawan dari Google Sheets dengan range spesifik
function tampilDataKaryawan() {
    const SPREADSHEET_ID = '1-4TKlEk3vSKXUB_AYelWFoMJj8gLecH1ALKy7j8XqqM';
    const RANGE = 'Sheet1!B3:F10';
    const API_KEY = 'AIzaSyDa4vcPBXMuKZz8xnT6G1t04lSpSxzvjnU';

    fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`
    )
    .then(response => response.json())
    .then(data => {
        const values = data.values || [];
        const tableBody = document.getElementById('dataKaryawanBody');
        tableBody.innerHTML = '';

        // Membuat header tabel
        const headerRow = document.createElement('tr');
        ['No', 'Kode Karyawan', 'Nama', 'Email', 'Alamat', 'Jabatan', 'Aksi'].forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            headerRow.appendChild(th);
        });
        tableBody.appendChild(headerRow);

        // Menampilkan data karyawan
        values.forEach((row, index) => {
            const tr = document.createElement('tr');
            
            // Nomor
            const tdNo = document.createElement('td');
            tdNo.textContent = index + 1;
            tr.appendChild(tdNo);
            
            // Data karyawan
            row.forEach(cell => {
                const td = document.createElement('td');
                td.textContent = cell;
                tr.appendChild(td);
            });
            
            // Tombol aksi
            const tdAksi = document.createElement('td');
            tdAksi.innerHTML = `
                <button class="btn btn-sm btn-warning" onclick="editKaryawan(${index})">
                    <i class="bi bi-pencil"></i> Edit
                </button>
                <button class="btn btn-sm btn-danger" onclick="hapusKaryawan(${index})">
                    <i class="bi bi-trash"></i> Hapus
                </button>
            `;
            tr.appendChild(tdAksi);
            
            tableBody.appendChild(tr);
        });
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Terjadi kesalahan saat mengambil data karyawan');
    });
}

// Fungsi untuk menambah karyawan baru
function tambahKaryawan(data) {
    const SPREADSHEET_ID = '1-4TKlEk3vSKXUB_AYelWFoMJj8gLecH1ALKy7j8XqqM';
    const API_KEY = 'AIzaSyDa4vcPBXMuKZz8xnT6G1t04lSpSxzvjnU';

    fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}:batchUpdate`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                requests: [{
                    appendCells: {
                        sheetId: 0,
                        rows: [{
                            values: [
                                { userEnteredValue: { stringValue: data.nama } },
                                { userEnteredValue: { stringValue: data.jabatan } },
                                { userEnteredValue: { stringValue: data.divisi } },
                                { userEnteredValue: { stringValue: data.status } }
                            ]
                        }]
                    }
                }]
            })
        }
    )
    .then(response => {
        if (response.ok) {
            alert('Karyawan berhasil ditambahkan!');
            tampilDataKaryawan(); // Refresh tabel
        } else {
            throw new Error('Gagal menambah karyawan');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Terjadi kesalahan saat menambah karyawan');
    });
}

// Fungsi untuk menampilkan modal tambah karyawan
function showTambahKaryawanModal() {
    const modalHtml = `
        <div class="modal fade" id="tambahKaryawanModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Tambah Karyawan Baru</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="formTambahKaryawan">
                            <div class="mb-3">
                                <label class="form-label">Nama</label>
                                <input type="text" class="form-control" name="nama" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Jabatan</label>
                                <input type="text" class="form-control" name="jabatan" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Divisi</label>
                                <input type="text" class="form-control" name="divisi" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Status</label>
                                <select class="form-select" name="status" required>
                                    <option value="Aktif">Aktif</option>
                                    <option value="Tidak Aktif">Tidak Aktif</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                        <button type="button" class="btn btn-primary" onclick="submitTambahKaryawan()">Simpan</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modal = new bootstrap.Modal(document.getElementById('tambahKaryawanModal'));
    modal.show();
}

// Fungsi untuk submit form tambah karyawan
function submitTambahKaryawan() {
    const form = document.getElementById('formTambahKaryawan');
    const formData = new FormData(form);
    
    const data = {
        nama: formData.get('nama'),
        jabatan: formData.get('jabatan'),
        divisi: formData.get('divisi'),
        status: formData.get('status')
    };

    tambahKaryawan(data);
    bootstrap.Modal.getInstance(document.getElementById('tambahKaryawanModal')).hide();
}


// Fungsi untuk notifikasi
$(".x-notif").click(function(e){
    e.preventDefault()
    $((".x-notif-menu")).toggle()
})

// Fungsi toggle sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const content = document.querySelector('.col-md-9');
    
    if(sidebar.style.display === 'none') {
        sidebar.style.display = 'block';
        content.classList.remove('col-md-12');
        content.classList.add('col-md-9');
    } else {
        sidebar.style.display = 'none'; 
        content.classList.remove('col-md-9');
        content.classList.add('col-md-12');
    }
}

// Fungsi untuk menangani klik pada link sidebar
document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', function(e) {
        // Hapus kelas active dari semua link
        document.querySelectorAll('.sidebar-link').forEach(l => {
            l.classList.remove('active');
        });

        // Tambahkan kelas active ke link yang diklik
        this.classList.add('active');

        // Jika link memiliki submenu
        if(this.dataset.bsToggle === 'collapse') {
            // Tutup semua submenu lainnya
            document.querySelectorAll('.collapse').forEach(submenu => {
                if(submenu.id !== this.dataset.bsTarget.replace('#','')) {
                    submenu.classList.remove('show');
                }
            });
        }
    });
});

// Fungsi untuk menandai link aktif berdasarkan halaman saat ini
function setActiveSidebarLink() {
    const currentPage = window.location.pathname.split('/').pop();
    
    document.querySelectorAll('.sidebar-link').forEach(link => {
        if(link.getAttribute('href') === currentPage) {
            link.classList.add('active');
            
            // Buka parent submenu jika ada
            const parentSubmenu = link.closest('.collapse');
            if(parentSubmenu) {
                parentSubmenu.classList.add('show');
                document.querySelector(`[data-bs-target="#${parentSubmenu.id}"]`).classList.add('active');
            }
        }
    });
}

// Jalankan saat halaman dimuat
document.addEventListener('DOMContentLoaded', setActiveSidebarLink);



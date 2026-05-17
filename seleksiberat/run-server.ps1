$port = 8000
$folder = Split-Path -Parent $MyInvocation.MyCommand.Path
Write-Host "Menjalankan server lokal di folder: $folder" -ForegroundColor Cyan

# Try to get the local IPv4 address on the active network adapter
$ip = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {
    $_.IPAddress -notlike '127.*' -and $_.IPAddress -notlike '169.254.*' -and $_.IPAddress -notlike '::1'
} | Select-Object -First 1 -ExpandProperty IPAddress)

if (-not $ip) {
    Write-Warning 'Tidak ditemukan IP lokal. Pastikan komputer terhubung ke jaringan yang sama dengan HP.'
}
else {
    Write-Host "Akses dari HP: http://$ip:$port/" -ForegroundColor Green
}

Set-Location $folder
python -m http.server $port
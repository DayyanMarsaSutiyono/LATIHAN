document.getElementById('askBtn').addEventListener('click', async ()=>{
  const q = document.getElementById('question').value.trim();
  if(!q)return alert('Masukkan pertanyaan.');
  document.getElementById('answer').textContent = 'Memproses...';
  document.getElementById('score').textContent = '';
  try{
    const res = await fetch('/ask', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question:q})});
    const data = await res.json();
    if(data.error){
      document.getElementById('answer').textContent = data.error;
    } else {
      document.getElementById('answer').textContent = data.answer;
      document.getElementById('score').textContent = 'Confidence: ' + (data.score||0).toFixed(3);
    }
  }catch(err){
    document.getElementById('answer').textContent = 'Terjadi kesalahan koneksi.';
    console.error(err);
  }
});

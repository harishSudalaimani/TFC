const form=document.querySelector("#jerseyForm"),button=document.querySelector("#submitBtn"),message=document.querySelector("#message"),players=document.querySelector("#players"),count=document.querySelector("#count");

function escapeHtml(value){const d=document.createElement("div");d.textContent=value;return d.innerHTML}

async function loadPlayers(){
  try{
    const response=await fetch("/api/players",{cache:"no-store"});
    const data=await response.json();
    if(!response.ok)throw new Error();
    count.textContent=data.players.length;
    players.innerHTML=data.players.length?data.players.map(p=>`
      <div class="player">
        <div class="player-name">${escapeHtml(p.name)}</div>
        <div class="player-size">${escapeHtml(p.size)}</div>
        <div class="player-number">${p.jersey_number}</div>
      </div>`).join(""):`<p class="empty">No players yet. Be the first.</p>`;
  }catch{players.innerHTML=`<p class="empty">Could not load the squad.</p>`}
}

form.addEventListener("submit",async e=>{
  e.preventDefault();message.textContent="";message.className="message";button.disabled=true;button.firstElementChild.textContent="SAVING...";
  const data={name:form.name.value.trim(),size:form.size.value,number:Number(form.number.value)};
  try{
    const response=await fetch("/api/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});
    const result=await response.json();
    if(!response.ok)throw new Error(result.error||"Could not save registration.");
    form.reset();message.textContent="Jersey registered ✓";message.className="message ok";
    await loadPlayers();
  }catch(error){message.textContent=error.message;message.className="message error"}
  finally{button.disabled=false;button.firstElementChild.textContent="SUBMIT JERSEY"}
});

loadPlayers();
setInterval(loadPlayers,15000);

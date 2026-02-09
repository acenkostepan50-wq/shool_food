import { useState } from "react";

function App() {
  const days = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница"];

  const fullMenu = {
    Понедельник: { Завтрак:[{name:"Овсянка"},{name:"Яйцо всмятку"},{name:"Компот"}], Обед:[{name:"Суп овощной"},{name:"Котлета с гарниром"},{name:"Компот"}]},
    Вторник: { Завтрак:[{name:"Бутерброд с сыром"},{name:"Йогурт"},{name:"Компот"}], Обед:[{name:"Борщ"},{name:"Курица с рисом"},{name:"Компот"}]},
    Среда: { Завтрак:[{name:"Сырники"},{name:"Мёд"},{name:"Компот"}], Обед:[{name:"Суп-пюре из тыквы"},{name:"Паста с мясом"},{name:"Компот"}]},
    Четверг: { Завтрак:[{name:"Овсянка с ягодами"},{name:"Яйцо всмятку"},{name:"Компот"}], Обед:[{name:"Котлета с картошкой"},{name:"Салат"},{name:"Компот"}]},
    Пятница: { Завтрак:[{name:"Блинчики"},{name:"Сметана"},{name:"Компот"}], Обед:[{name:"Рыба с гарниром"},{name:"Салат"},{name:"Компот"}]}
  };

  const accounts = [
    { role: "ученик", username: "1", password: "0000" },
    { role: "повар", username: "2", password: "0000" },
    { role: "админ", username: "3", password: "0000" }
  ];

  const productMapping = {
    "Овсянка":"Овсянка","Яйцо всмятку":"Яйцо","Компот":"Компот",
    "Суп овощной":"Суп овощной","Котлета с гарниром":"Котлета с гарниром",
    "Бутерброд с сыром":"Бутерброд с сыром","Йогурт":"Йогурт","Борщ":"Борщ","Курица с рисом":"Курица с рисом",
    "Сырники":"Сырники","Мёд":"Мёд","Суп-пюре из тыквы":"Суп-пюре из тыквы","Паста с мясом":"Паста с мясом",
    "Овсянка с ягодами":"Овсянка","Котлета с картошкой":"Котлета с картошкой","Салат":"Салат",
    "Блинчики":"Блинчики","Сметана":"Сметана","Рыба с гарниром":"Рыба с гарниром"
  };

  const initialProducts = {
    "Овсянка":10,"Яйцо":10,"Компот":20,"Суп овощной":5,"Котлета с гарниром":5,
    "Бутерброд с сыром":5,"Йогурт":5,"Борщ":5,"Курица с рисом":5,"Сырники":5,
    "Мёд":5,"Суп-пюре из тыквы":5,"Паста с мясом":5,"Котлета с картошкой":5,"Салат":5,
    "Блинчики":5,"Сметана":5,"Рыба с гарниром":5
  };

  const [roleSelect,setRoleSelect] = useState("");
  const [user,setUser] = useState(null);
  const [login,setLogin] = useState({username:"",password:""});
  const [selectedDay,setSelectedDay] = useState(days[0]);
  const [payments,setPayments] = useState({});
  const [received,setReceived] = useState({});
  const [issuedMeals,setIssuedMeals] = useState({});
  const [requests,setRequests] = useState([]);
  const [approvedRequests,setApprovedRequests] = useState([]);
  const [stats,setStats] = useState({totalPayments:0,totalMeals:0,attendance:0});
  const [reviews,setReviews] = useState([]);
  const [allergies,setAllergies] = useState([]);
  const [newReview,setNewReview] = useState("");
  const [newAllergy,setNewAllergy] = useState("");
  const [newRequest,setNewRequest] = useState({product:"",quantity:0});
  const [products,setProducts] = useState(initialProducts);
  const [notification,setNotification] = useState(null);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(()=>setNotification(null),3000);
  };

  const handleLogin = () => {
    const account = accounts.find(a=>a.username===login.username && a.password===login.password && a.username===roleSelect);
    if(account){
      setUser({role:account.role,name:account.username});
      setLogin({username:"",password:""});
      showNotification(`Вход выполнен как ${account.role}`);
      if(account.role==="ученик") setStats({...stats,attendance:stats.attendance+1});
    }else showNotification("Неверный логин или пароль");
  };

  const payMeal=(type,mealType)=>{
    const key=`${selectedDay}-${mealType}`;
    setPayments({...payments,[key]:type});
    setReceived({...received,[key]:true});
    setStats({...stats,totalPayments:stats.totalPayments+1,totalMeals:stats.totalMeals+1});
    showNotification(`Оплата ${mealType.toLowerCase()} (${type}) проведена`);
  };

  const issueMeal=(mealType)=>{
    const mealItems=fullMenu[selectedDay][mealType];
    let enoughStock=true;
    mealItems.forEach(item=>{
      const pname=productMapping[item.name];
      if(!products[pname]||products[pname]<=0) enoughStock=false;
    });
    if(!enoughStock) return showNotification("Недостаточно продуктов для выдачи");

    const newProducts={...products};
    mealItems.forEach(item=>{
      const pname=productMapping[item.name];
      newProducts[pname]-=1;
    });

    setProducts(newProducts);
    setIssuedMeals({...issuedMeals,[mealType]:(issuedMeals[mealType]||0)+1});
    setStats({...stats,totalMeals:stats.totalMeals+1});
    showNotification(`${mealType} выдан`);
  };

  const submitRequest=()=>{
    if(newRequest.product && newRequest.quantity>0){
      setRequests([...requests,{...newRequest,approved:false}]);
      setNewRequest({product:"",quantity:0});
      showNotification("Заявка создана");
    }
  };

  const approveRequest=(index)=>{
    const newReqs=[...requests];
    newReqs[index].approved=true;
    setApprovedRequests([...approvedRequests,newReqs[index]]);
    setRequests(newReqs.filter((_,i)=>i!==index));
    showNotification("Заявка согласована");
  };

  const styles={
    app:{fontFamily:"'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",background:"#f7f9fc",minHeight:"100vh",padding:20},
    card:{background:"#fff",borderRadius:12,padding:25,marginBottom:25,boxShadow:"0 6px 18px rgba(0,0,0,0.1)",transition:"0.3s"},
    button:{padding:"10px 20px",margin:"5px",border:"none",borderRadius:6,cursor:"pointer",transition:"0.3s",fontWeight:"bold"},
    buttonPrimary:{backgroundColor:"#757575",color:"#fff"},
    buttonSecondary:{backgroundColor:"#9e9e9e",color:"#fff"},
    buttonDanger:{backgroundColor:"#f44336",color:"#fff"},
    input:{padding:"8px 12px",borderRadius:6,border:"1px solid #ccc",marginBottom:10,width:"100%"},
    select:{padding:"8px 12px",borderRadius:6,marginBottom:15,width:"100%"},
    cardMenu:{padding:15,borderRadius:8,margin:"10px 0",background:"#e9f0f7",boxShadow:"0 2px 5px rgba(0,0,0,0.05)",transition:"0.3s"},
    notification:{position:"fixed",top:20,right:20,background:"#4CAF50",color:"#fff",padding:"10px 20px",borderRadius:8,boxShadow:"0 2px 10px rgba(0,0,0,0.2)",zIndex:1000,animation:"fadein 0.5s, fadeout 0.5s 2.5s"}
  };

  return (
    <div style={styles.app}>
      <h1 style={{textAlign:"center",marginBottom:30,color:"#333333"}}>Школьная еда</h1>
      {notification && <div style={styles.notification}>{notification}</div>}

      {/* Выбор роли */}
      {!roleSelect && !user && <div style={styles.card}>
        <h2>Выберите роль</h2>
        <button style={{...styles.button,...styles.buttonPrimary}} onClick={()=>setRoleSelect("1")}>Ученик</button>
        <button style={{...styles.button,...styles.buttonPrimary}} onClick={()=>setRoleSelect("2")}>Повар</button>
        <button style={{...styles.button,...styles.buttonPrimary}} onClick={()=>setRoleSelect("3")}>Админ</button>
      </div>}

      {/* Login */}
      {roleSelect && !user && <div style={styles.card}>
        <h2>Вход</h2>
        <input style={styles.input} placeholder="Логин" value={login.username} onChange={e=>setLogin({...login,username:e.target.value})}/>
        <input style={styles.input} type="password" placeholder="Пароль" value={login.password} onChange={e=>setLogin({...login,password:e.target.value})}/>
        <button style={{...styles.button,...styles.buttonPrimary}} onClick={handleLogin}>Войти</button>
        <button style={{...styles.button,...styles.buttonSecondary}} onClick={()=>setRoleSelect("")}>Назад</button>
      </div>}

      {/* Ученики */}
      {user && user.role==="ученик" && <div style={styles.card}>
        <h2>Ученик: {user.name}</h2>
        <button style={styles.button} onClick={()=>{setUser(null); setRoleSelect("");}}>Назад</button>
        <h3>Выберите день недели</h3>
        <select style={styles.select} value={selectedDay} onChange={e=>setSelectedDay(e.target.value)}>
          {days.map(day=><option key={day} value={day}>{day}</option>)}
        </select>
        {["Завтрак","Обед"].map(mealType=>(
          <div key={mealType}>
            <h3>{mealType}</h3>
            {fullMenu[selectedDay][mealType].map((item,i)=><div key={i} style={styles.cardMenu}>{item.name}</div>)}
            {!payments[`${selectedDay}-${mealType}`]?<>
              <button style={{...styles.button,...styles.buttonPrimary}} onClick={()=>payMeal("разово",mealType)}>Разово</button>
              <button style={{...styles.button,...styles.buttonSecondary}} onClick={()=>payMeal("абонемент",mealType)}>Абонемент</button>
            </>:<p style={{color:"green",fontWeight:"bold"}}>✅ Оплачено и получено</p>}
          </div>
        ))}
        <h3>Пищевые аллергии</h3>
        <input style={styles.input} placeholder="Добавить аллергию" value={newAllergy} onChange={e=>setNewAllergy(e.target.value)}/>
        <button style={{...styles.button,...styles.buttonPrimary}} onClick={()=>{setAllergies([...allergies,newAllergy]); setNewAllergy(""); showNotification("Аллергия добавлена")}}>Добавить</button>
        <ul>{allergies.map((a,i)=><li key={i}>{a}</li>)}</ul>

        <h3>Отзывы о блюдах</h3>
        <input style={styles.input} placeholder="Ваш отзыв" value={newReview} onChange={e=>setNewReview(e.target.value)}/>
        <button style={{...styles.button,...styles.buttonSecondary}} onClick={()=>{setReviews([...reviews,newReview]); setNewReview(""); showNotification("Отзыв добавлен")}}>Добавить</button>
        <ul>{reviews.map((r,i)=><li key={i}>{r}</li>)}</ul>
      </div>}

      {/* Повар */}
      {user && user.role==="повар" && <div style={styles.card}>
        <h2>Повар: {user.name}</h2>
        <button style={styles.button} onClick={()=>{setUser(null); setRoleSelect("");}}>Назад</button>

        <h3>Учёт выданных блюд</h3>
        {["Завтрак","Обед"].map(mealType=>(
          <div key={mealType}>
            <p>{mealType}: {issuedMeals[mealType]||0}</p>
            <button style={{...styles.button,...styles.buttonPrimary}} onClick={()=>issueMeal(mealType)}>Выдать {mealType.toLowerCase()}</button>
          </div>
        ))}

        <h3>Остатки продуктов</h3>
        <ul>
          {Object.entries(products).map(([name,count])=><li key={name}>{name}: {count}</li>)}
        </ul>

        <h3>Заявки на продукты</h3>
        <input style={styles.input} placeholder="Продукт" value={newRequest.product} onChange={e=>setNewRequest({...newRequest,product:e.target.value})}/>
        <input style={styles.input} type="number" placeholder="Количество" value={newRequest.quantity} onChange={e=>setNewRequest({...newRequest,quantity:Number(e.target.value)})}/>
        <button style={{...styles.button,...styles.buttonPrimary}} onClick={submitRequest}>Создать заявку</button>
        <ul>{requests.filter(r=>r.quantity>0).map((r,i)=><li key={i}>{r.product} - {r.quantity}</li>)}</ul>
      </div>}

      {/* Админ */}
      {user && user.role==="админ" && <div style={styles.card}>
        <h2>Админ: {user.name}</h2>
        <button style={styles.button} onClick={()=>{setUser(null); setRoleSelect("");}}>Назад</button>

        <h3>Статистика</h3>
        <p>Всего оплат: {stats.totalPayments}</p>
        <p>Всего выдано блюд: {stats.totalMeals}</p>
        <p>Посещаемость: {stats.attendance}</p>

        <h3>Согласование заявок</h3>
        <ul>{requests.map((r,i)=><li key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0"}}>
          <span>{r.product} - {r.quantity} (Ожидает)</span>
          <button style={{...styles.button,...styles.buttonPrimary}} onClick={()=>approveRequest(i)}>Согласовать</button>
        </li>)}</ul>

        <h3>Сформированные отчёты</h3>
        <ul>{approvedRequests.map((r,i)=><li key={i}>{r.product} - {r.quantity}</li>)}</ul>
      </div>}

      <style>{`
        .card:hover { transform: scale(1.02); }
        .cardMenu:hover { transform: scale(1.02); background: #d9eaf7; }
        button:hover { opacity: 0.85; }
        @keyframes fadein { from {opacity:0; transform:translateY(-20px);} to {opacity:1; transform:translateY(0);} }
        @keyframes fadeout { from {opacity:1;} to {opacity:0;} }
      `}</style>
    </div>
  );
}

export default App;

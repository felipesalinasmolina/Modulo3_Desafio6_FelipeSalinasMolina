const form = document.getElementById('conversor');
const chart = document.getElementById("myChart");

let myChart;

const obtenerDatosDivisa = async (divisa) => {
  try { 
    const valores = await fetch(`https://mindicador.cl/api/${divisa}`);
    const resultados = await valores.json();
    console.log(resultados);
    return resultados.serie;
  } catch (e) {
    alert(e.message);
  }
};



const calcularTotalendivisas = (valor, datos) => {
  const valorDivisa = datos[0].valor;
  const total = valor / valorDivisa;
  return Math.round(total * 100) / 100;
};

const mostrarEnPantalla = (total) => {
  document.getElementById("total_valor").innerHTML = total;
};

const obtenerValores = (datos) => {
  return datos.map((item) => item.valor);
};

const obtenerFechas = (datos) => {
  return datos.map((item) => new Date(item.fecha).toLocaleTimeString('en-US'));
};

const borraGrafico = () => {
  if (myChart) {
    myChart.destroy();
  }
};


const mostrarGrafico = (datos, valor) => {
  const total = calcularTotalendivisas(valor, datos);
  mostrarEnPantalla(total); 

  const labels = obtenerFechas(datos);
  const values = obtenerValores(datos);

  const datasets = [
    {
      label: "Divisa",
      borderColor: "green",
      data: values,
    },
  ];
  const config = {
    type: "line",
    data: { labels, datasets },
  };

  borraGrafico();

  chart.style.backgroundColor = "white";
  chart.style.borderRadius = "10px";

  myChart = new Chart(chart, config);
};

const calcularValorEnMoneda = async (valor, moneda) => {
  const datos = await obtenerDatosDivisa(moneda);
  mostrarGrafico(datos, valor);
  
};


form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const valor = form.elements["valor"].value;
  const divisa = form.elements["divisa"].value;

  if (!divisa) {
    alert("Ingrese una divisa");  
    return;
  }
  if (!valor) {
    alert("Ingrese una cantidad");
    return;
  }
  
  
  await calcularValorEnMoneda(valor, divisa);
});

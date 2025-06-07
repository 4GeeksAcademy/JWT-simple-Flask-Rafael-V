const getState = ({ getStore, getActions, setStore }) => {
   
    const apiUrl = process.env.BACKEND_URL; 

    return {
        store: {
            message: null,
            demo: [
                {
                    title: "FIRST",
                    background: "white",
                    initial: "white"
                },
                {
                    title: "SECOND",
                    background: "white",
                    initial: "white"
                }
            ],
           
            token: null,
            currentUser: null
        },
        actions: { 
           
            exampleFunction: () => {
                getActions().changeColor(0, "green");
            },

            getMessage: async () => {
                try{
                   
                    const resp = await fetch(`${apiUrl}/api/hello`) 
                    const data = await resp.json()
                    setStore({ message: data.message })
                    
                    return data;
                }catch(error){
                    console.log("Error loading message from backend", error)
                }
            },
            changeColor: (index, color) => {
               
                const store = getStore();

                
                const demo = store.demo.map((elm, i) => {
                    if (i === index) elm.background = color;
                    return elm;
                });

               
                setStore({ demo: demo });
            },

            register: async (userData) => { 
                try {
                    const resp = await fetch(`${apiUrl}/api/signup`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(userData)
                    });

                    if (!resp.ok) {
                        const errorData = await resp.json();
                        console.error("Error al registrar usuario:", errorData.msg || "Error desconocido");
                        return false;
                    }

                    await resp.json(); 
                    return true;
                } catch (error) {
                    console.error("Error al registrar usuario:", error);
                    return false;
                }
            },

            login: async (email, password) => {
                try {
                    const resp = await fetch(`${apiUrl}/api/login`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ email, password })
                    });

                    if (!resp.ok) {
                        const errorData = await resp.json();
                        console.error("Error al iniciar sesión:", errorData.msg || "Error desconocido");
                        return false;
                    }

                    const data = await resp.json();
                    localStorage.setItem("token", data.access_token);
                    localStorage.setItem("user", JSON.stringify(data.user)); 
                    setStore({ token: data.access_token, currentUser: data.user }); 
                    return true;
                } catch (error) {
                    console.error("Error al iniciar sesión:", error);
                    return false;
                }
            },

            getDashboardData: async () => {
                const token = localStorage.getItem("token");

                if (!token) {
                    setStore({ message: "No tienes sesión iniciada" });
                    return false;
                }

                try {
                    const resp = await fetch(`${apiUrl}/api/dashboard`, {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });

                    if (!resp.ok) {
                        if (resp.status === 401) {
                            setStore({ message: "Sesión expirada. Inicia sesión nuevamente." });
                            getActions().logout(); 
                        } else {
                            setStore({ message: "Error al cargar el dashboard." });
                        }
                        return false;
                    }

                    const data = await resp.json();
                    return data;
                } catch (error) {
                    console.error("Error de red:", error);
                    setStore({ message: "No se pudo conectar al servidor." });
                    return false;
                }
            },

           
            logout: () => {
                localStorage.removeItem("token");
                localStorage.removeItem("user"); 
                setStore({
                    token: null,
                    currentUser: null
                });
                console.log("Sesión cerrada.");
            },
            
        
            syncTokenFromLocalStorage: () => {
                const token = localStorage.getItem("token");
                const user = JSON.parse(localStorage.getItem("user"));
                if (token && user) {
                    setStore({ token: token, currentUser: user });
                    console.log("Token y usuario sincronizados desde localStorage.");
                }
            }
        } 
    };
};

export default getState;

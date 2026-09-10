# Cancionero — puesta en marcha, paso a paso

> **Ya montado:** app en <https://jcarloshq72.github.io/cancionero/>,
> proyecto de Firebase `cancionero-fe602`. Lo de abajo queda como referencia
> por si hay que repetirlo o montarlo en otra cuenta.

Al terminar tendrás la app en una dirección propia
(`https://TU-USUARIO.github.io/cancionero/`), gratis, y con las canciones
**sincronizadas al instante** entre el PC, el móvil y la tablet.

Son unos 15 minutos y se hace una sola vez. No hace falta saber programar ni
usar git: todo se hace desde la web.

Necesitas: una cuenta de Google y una cuenta de GitHub (gratis).

---

# PARTE A — La base de datos (Firebase)

Es lo que hace que una canción añadida en el PC aparezca en el móvil al
momento. El plan gratuito da 1 GB y 20.000 escrituras al día — un cancionero
gasta una milésima parte. **No pide tarjeta.**

## A1. Crear el proyecto

1. Entra en <https://console.firebase.google.com> con tu cuenta de Google.
2. **Crear un proyecto**.
3. Nombre: `cancionero` → **Continuar**.
4. Google Analytics: **desactívalo** (no hace falta) → **Crear proyecto**.
5. Espera a que termine → **Continuar**.

## A2. Encender la base de datos

1. Menú de la izquierda: **Bases de datos y almacenamiento → Firestore Database**.
   (En consolas más antiguas era *Compilación → Firestore Database*.)
2. **Crear base de datos**.
3. Ubicación: la más cercana a ti, por ejemplo `southamerica-east1`.
   ⚠️ **Esto no se puede cambiar después.**
4. Elige **Comenzar en modo de producción** → **Crear**.

## A3. Encender el acceso con Google

1. Menú de la izquierda: **Seguridad → Authentication** → **Comenzar**.
2. Pestaña **Método de acceso** (antes *Sign-in method*).
3. Pulsa **Google** → activa el interruptor **Habilitar**.
4. **Correo electrónico de asistencia**: elige el tuyo.
5. **Guardar**.

## A4. Poner las reglas de seguridad

Esto es lo que hace que **solo tú** puedas leer y escribir tu repertorio. No te
lo saltes.

1. Menú izquierdo → **Firestore** → pestaña **Reglas**.
2. Borra todo lo que haya y pega exactamente esto:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /usuarios/{uid}/{documento=**} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

3. **Publicar** (arriba a la derecha; puede quedar fuera de la ventana, ensánchala
   si no lo ves). Sabrás que funcionó porque aparece una versión nueva con la
   hora en la columna de la izquierda.

## A5. Copiar tu configuración

1. Arriba a la izquierda, la rueda dentada **⚙ → Configuración del proyecto**.
2. Baja hasta **Tus aplicaciones**.
3. Pulsa el icono **`</>`** (Web).
4. Apodo de la app: `cancionero`. **NO** marques "Firebase Hosting".
5. **Registrar app**.
6. Verás un bloque parecido a este:

```js
const firebaseConfig = {
  apiKey: "AIzaSyB....",
  authDomain: "cancionero-1a2b3.firebaseapp.com",
  projectId: "cancionero-1a2b3",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "1:123456789012:web:abc123def456"
};
```

7. Abre el archivo **`firebase.json`** que te pasé y sustituye los cuatro
   valores por los tuyos. Solo hacen falta esos cuatro:

```json
{
  "apiKey": "AIzaSyB....",
  "authDomain": "cancionero-1a2b3.firebaseapp.com",
  "projectId": "cancionero-1a2b3",
  "appId": "1:123456789012:web:abc123def456"
}
```

> **¿No es peligroso que esto sea público?** No. La configuración de Firebase
> está pensada para ir a la vista dentro de la página; no es una contraseña.
> Lo que protege tus datos son las reglas del paso A4, que atan cada
> repertorio a la cuenta que entró.

---

# PARTE B — La dirección web (GitHub Pages)

## B1. Crear el repositorio

1. Crea una cuenta gratis en <https://github.com> si no la tienes.
2. Entra en <https://github.com/new>.
3. **Repository name**: `cancionero`
4. Marca **Public** (Pages gratis solo funciona en repositorios públicos).
5. **Create repository**.

## B2. Subir los archivos

1. En la página del repositorio, pulsa el enlace
   **uploading an existing file**.
2. Arrastra **los dos archivos**:
   - `index.html`
   - `firebase.json` (el tuyo, ya rellenado)
3. Abajo, **Commit changes**.

## B3. Encender Pages

1. **Settings** (arriba) → **Pages** (menú de la izquierda).
2. **Source**: `Deploy from a branch`
3. **Branch**: `main` y carpeta `/ (root)` → **Save**.
4. Espera 1-2 minutos. Arriba aparecerá tu dirección:

   `https://TU-USUARIO.github.io/cancionero/`

## B4. Autorizar ese dominio en Firebase

⚠️ **Este es el paso que más se olvida.** Si te lo saltas, el botón de entrar
no hará nada y parecerá que la app está rota.

Atajo directo (cambia el id por el de tu proyecto):
`https://console.firebase.google.com/project/TU-PROYECTO/authentication/settings`

1. **Authentication → Configuración → Dominios autorizados**.
2. **Agregar un dominio**: escribe `TU-USUARIO.github.io`
   (solo eso, sin `https://` y sin `/cancionero`).
3. **Agregar**. Aparecerá en la lista con tipo *Custom*.

---

# PARTE C — Meter tus canciones

La base empieza vacía. Tus 24 canciones están en el archivo
`cancionero.json` que te pasé.

1. Abre `https://TU-USUARIO.github.io/cancionero/`
2. Pulsa **Entrar con Google** y elige tu cuenta.
3. Arriba de la lista: **Copia ⇅ → Restaurar desde archivo**.
4. Elige `cancionero.json` → acepta el aviso.
5. Aparecen las 24 canciones.

**Desde aquí ya no tienes que hacer nada más.** En el móvil abres la misma
dirección, entras con la misma cuenta de Google, y está todo. Lo que añadas en
un sitio aparece en el otro al instante.

Consejo: en el móvil, "Añadir a pantalla de inicio" desde el menú del
navegador. Queda como una app más.

---

# Si algo no funciona

| Qué ves | Qué pasa |
|---|---|
| El botón **Entrar con Google** no hace nada | Falta el paso **B4**. O el navegador bloqueó la ventana emergente: permítela para ese sitio. |
| `Missing or insufficient permissions` | Las reglas del paso **A4** no se publicaron. Vuelve y pulsa **Publicar**. |
| Sigue diciendo *"Guardando en este navegador"* | El `firebase.json` no está junto al `index.html` en el repositorio, o tiene una errata. Ábrelo en GitHub y comprueba que se ve el JSON. |
| `auth/unauthorized-domain` | Otra vez el paso **B4**: el dominio escrito no coincide. |
| La página sale en blanco | Espera 2 minutos más: Pages tarda en publicar la primera vez. |

---

# Cosas que conviene saber

**Sin Firebase también funciona.** Si no montas la Parte A, la app guarda en el
navegador de cada dispositivo y los pones al día con **Copia ⇅**. Todo lo demás
es idéntico.

**Sin internet.** Guarda el `index.html` en el móvil o el PC y ábrelo con doble
clic: funciona igual. Lo único que necesita conexión es leer PDF (la librería
se descarga la primera vez); los Word se leen sin conexión.

**Haz copias.** De vez en cuando, **Copia ⇅ → Descargar copia**. Es un archivo
con todo tu repertorio y no depende de nadie.

**Si cambias la app.** El `index.html` **se genera**, no se edita a mano. La
fuente es `web/acordes.html`. Después de tocarla:

```bash
py "D:\PROYECTO APP\Acordes\web\construir.py"
```

y vuelve a subir `sitio/index.html` al repositorio.

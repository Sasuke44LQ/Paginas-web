// Vectores.cpp
// Implementación de operaciones básicas para vectores en C++
// Este archivo proporciona funciones para leer, imprimir y operar
// con vectores (suma, resta, escalar, producto punto y norma).
// Comentarios en español explican el propósito y las consideraciones.

#include <iostream>
#include <vector>
#include <cmath>
#include <iomanip>
#include <stdexcept>
#include <limits>
#include <thread>
#include <chrono>
#include <fstream>
#include <ctime>
#include <sstream>
#include <string>

using namespace std;

// ----- Interfaz llamativa: banner, limpieza de pantalla y pausa -----

// Limpiar pantalla: usa CLS en Windows, clear en otros sistemas
inline void limpiar_pantalla() {
#if defined(_WIN32) || defined(_WIN64)
    system("cls");
#else
    system("clear");
#endif
}

// Mostrar un banner ASCII simple
void mostrar_banner() {
    cout << "+" << string(58, '-') << "+\n";
    cout << "|" << setw(30) << "" << "OPERACIONES CON VECTORES" << setw(28) << "" << "|\n";
    cout << "|" << string(58, ' ') << "|\n";
    cout << "|  Programa: utilidades de álgebra lineal (vectores)" << setw(16) << "" << "|\n";
    cout << "|  Autor: (tu proyecto)" << setw(39) << "" << "|\n";
    cout << "+" << string(58, '-') << "+\n";
}

// Pausa hasta que el usuario presione Enter
void pausa_usuario() {
    cout << "\nPresione ENTER para continuar...";
    cin.ignore(numeric_limits<streamsize>::max(), '\n');
    cin.get();
}

// Mostrar menú con caja
void mostrar_menu_llamativo() {
    cout << "\n";
    cout << "+" << string(40, '=') << "+\n";
    cout << "|" << setw(13) << "" << "MENU PRINCIPAL" << setw(12) << "" << "|\n";
    cout << "+" << string(40, '=') << "+\n";
    cout << "| 1) Sumar vectores" << setw(21) << "" << "|\n";
    cout << "| 2) Restar vectores" << setw(20) << "" << "|\n";
    cout << "| 3) Multiplicar vector por escalar" << setw(6) << "" << "|\n";
    cout << "| 4) Producto punto" << setw(22) << "" << "|\n";
    cout << "| 5) Norma (||v||)" << setw(20) << "" << "|\n";
    cout << "| 6) Mostrar historial" << setw(13) << "" << "|\n";
    cout << "| 7) Limpiar historial" << setw(14) << "" << "|\n";
    cout << "| 8) Salir" << setw(30) << "" << "|\n";
    cout << "+" << string(40, '=') << "+\n";
}


// Leer un vector desde la entrada estándar
// - nombre: etiqueta que se muestra al pedir la dimensión (por ejemplo "vector 1")
// - valida la entrada para evitar dimensiones <= 0 y entradas no numéricas
// - devuelve un `vector<double>` con los elementos leídos
vector<double> pedir_datos(const string& nombre = "vector") {
    int n;
    cout << "Digite la dimension de " << nombre << ": ";
    // Validación: asegurar que la dimensión sea un entero positivo
    while (!(cin >> n) || n <= 0) {
        cout << "Dimension invalida. Intente de nuevo: ";
        cin.clear();
        cin.ignore(numeric_limits<streamsize>::max(), '\n');
    }

    vector<double> v(n);
    // Leer cada elemento del vector con validación de entrada
    for (int i = 0; i < n; ++i) {
        cout << "Digite el elemento " << i + 1 << ": ";
        while (!(cin >> v[i])) {
            cout << "Entrada invalida. Digite nuevamente el elemento " << i + 1 << ": ";
            cin.clear();
            cin.ignore(numeric_limits<streamsize>::max(), '\n');
        }
    }
    return v;
}

// Imprimir vector en una sola línea con formato fijo
// - muestra `nombre = [e1, e2, ...]`
// - util para inspección rápida de resultados
void imprimir_vector(const vector<double>& v, const string& nombre = "v") {
    cout << nombre << " = [";
    for (size_t i = 0; i < v.size(); ++i) {
        cout << fixed << setprecision(6) << v[i];
        if (i + 1 < v.size()) cout << ", ";
    }
    cout << "]" << endl;
}

// Sumar vectores elemento a elemento
// - Requiere que los vectores tengan la misma dimensión
// - Lanza `invalid_argument` si las dimensiones no coinciden
vector<double> sumar_vectores(const vector<double>& a, const vector<double>& b) {
    if (a.size() != b.size()) throw invalid_argument("Tamanos incompatibles para sumar");
    vector<double> r(a.size());
    for (size_t i = 0; i < a.size(); ++i) r[i] = a[i] + b[i];
    return r;
}

// Restar vectores (a - b)
// - Igual que la suma, requiere iguales dimensiones
vector<double> restar_vectores(const vector<double>& a, const vector<double>& b) {
    if (a.size() != b.size()) throw invalid_argument("Tamanos incompatibles para restar");
    vector<double> r(a.size());
    for (size_t i = 0; i < a.size(); ++i) r[i] = a[i] - b[i];
    return r;
}

// Multiplicar un vector por un escalar
// - Devuelve un nuevo vector donde cada elemento es alpha * a[i]
vector<double> escalar_vector(const vector<double>& a, double alpha) {
    vector<double> r(a.size());
    for (size_t i = 0; i < a.size(); ++i) r[i] = alpha * a[i];
    return r;
}

// Producto escalar (producto punto) entre dos vectores
// - Suma de a[i] * b[i] para i=0..n-1
// - Lanza `invalid_argument` si las dimensiones no coinciden
double producto_punto(const vector<double>& a, const vector<double>& b) {
    if (a.size() != b.size()) throw invalid_argument("Tamanos incompatibles para producto punto");
    double s = 0.0;
    for (size_t i = 0; i < a.size(); ++i) s += a[i] * b[i];
    return s;
}

// Norma euclidiana (2-norma) del vector
// - Calcula sqrt(sum_i a[i]^2)
double norma(const vector<double>& a) {
    double s = 0.0;
    for (double val : a) s += val * val;
    return sqrt(s);
}

// ------------------------- Utilidades de historial y serialización -------------------------

// Convertir un vector a cadena con formato [e1,e2,...]
string vector_to_string(const vector<double>& v) {
    ostringstream ss;
    ss << "[";
    for (size_t i = 0; i < v.size(); ++i) {
        ss << fixed << setprecision(6) << v[i];
        if (i + 1 < v.size()) ss << ",";
    }
    ss << "]";
    return ss.str();
}

// ------------------------- Historial (archivo JSON por línea) -------------------------

// Escapar comillas y barras en una cadena para JSON simple
string escape_json(const string& s) {
    string out;
    for (char c : s) {
        if (c == '\\') out += "\\\\";
        else if (c == '"') out += "\\\"";
        else out += c;
    }
    return out;
}

// Obtener timestamp ISO simple
string timestamp_now() {
    time_t t = time(nullptr);
    tm tmv;
#if defined(_WIN32) || defined(_WIN64)
    // MSVC provides localtime_s; MinGW may not — use localtime fallback there
    #if defined(__MINGW32__) || defined(__MINGW64__)
        tm* tmp = localtime(&t);
        if (tmp) tmv = *tmp; else tmv = tm();
    #else
        localtime_s(&tmv, &t);
    #endif
#else
    localtime_r(&t, &tmv);
#endif
    char buf[64];
    strftime(buf, sizeof(buf), "%Y-%m-%dT%H:%M:%S", &tmv);
    return string(buf);
}

// Registrar una operación en el historial (archivo `historial.log`)
void logOperacion(const string& tipo, const string& entradas, const string& resultado) {
    ofstream f("historial.log", ios::app);
    if (!f) return;
    string ts = timestamp_now();
    f << "{\"timestamp\":\"" << ts << "\",\"tipo\":\"" << escape_json(tipo)
      << "\",\"entradas\":\"" << escape_json(entradas)
      << "\",\"resultado\":\"" << escape_json(resultado) << "\"}" << "\n";
}

// Mostrar historial leyendo cada línea JSON y presentándola formateada
void mostrar_historial() {
    ifstream f("historial.log");
    if (!f) {
        cout << "No hay historial registrado.\n";
        return;
    }
    cout << "\nHistorial de operaciones:\n";
    string line;
    int i = 1;
    while (getline(f, line)) {
        if (line.empty()) continue;
        cout << i++ << ") " << line << "\n";
    }
}

// Limpiar historial (elimina o trunca el archivo)
void limpiar_historial() {
    ofstream f("historial.log", ios::trunc);
    // si no se puede abrir, no es crítico; simplemente informar
    if (!f) cout << "No se pudo limpiar historial (permiso o archivo en uso).\n";
    else cout << "Historial limpiado correctamente.\n";
}

// ------------------------- Programa principal -------------------------

/**
 * Programa principal con interfaz llamativa y registro de historial.
 * Opciones disponibles:
 *  1) Sumar vectores
 *  2) Restar vectores
 *  3) Multiplicar vector por escalar
 *  4) Producto punto
 *  5) Norma (||v||)
 *  6) Mostrar historial
 *  7) Limpiar historial
 *  8) Salir
 */
int main() {
    int opcion = 0;

    // Mostrar banner inicial
    limpiar_pantalla();
    mostrar_banner();

    do {
        // Mostrar menú visible y atractivo
        mostrar_menu_llamativo();
        cout << "Seleccione una opcion: ";
        cin >> opcion;

        // Manejo de operaciones solicitadas por el usuario
        try {
            if (opcion == 1) {
                auto a = pedir_datos("vector 1");
                auto b = pedir_datos("vector 2");
                auto r = sumar_vectores(a, b);
                cout << "\nResultado:\n";
                imprimir_vector(r, "a + b");
                logOperacion("suma", vector_to_string(a) + " + " + vector_to_string(b), vector_to_string(r));
            } else if (opcion == 2) {
                auto a = pedir_datos("vector 1");
                auto b = pedir_datos("vector 2");
                auto r = restar_vectores(a, b);
                cout << "\nResultado:\n";
                imprimir_vector(r, "a - b");
                logOperacion("resta", vector_to_string(a) + " - " + vector_to_string(b), vector_to_string(r));
            } else if (opcion == 3) {
                auto a = pedir_datos("vector");
                double alpha;
                cout << "Digite el escalar: ";
                while (!(cin >> alpha)) { cout << "Escalar invalido. Intente de nuevo: "; cin.clear(); cin.ignore(numeric_limits<streamsize>::max(), '\n'); }
                auto r = escalar_vector(a, alpha);
                cout << "\nResultado:\n";
                imprimir_vector(r, "alpha * v");
                ostringstream entradas; entradas << "alpha=" << alpha << "; v=" << vector_to_string(a);
                logOperacion("escalar", entradas.str(), vector_to_string(r));
            } else if (opcion == 4) {
                auto a = pedir_datos("vector 1");
                auto b = pedir_datos("vector 2");
                double dp = producto_punto(a, b);
                cout << "\nResultado:\n";
                cout << "Producto punto = " << fixed << setprecision(6) << dp << endl;
                logOperacion("producto_punto", vector_to_string(a) + " . " + vector_to_string(b), to_string(dp));
            } else if (opcion == 5) {
                auto a = pedir_datos("vector");
                double nrm = norma(a);
                cout << "\nResultado:\n";
                cout << "Norma = " << fixed << setprecision(6) << nrm << endl;
                logOperacion("norma", vector_to_string(a), to_string(nrm));
            } else if (opcion == 6) {
                mostrar_historial();
            } else if (opcion == 7) {
                limpiar_historial();
            } else if (opcion == 8) {
                cout << "\nSaliendo...\n";
                break;
            } else {
                cout << "\nOpcion invalida. Intente de nuevo.\n";
            }
        } catch (const exception& e) {
            // Captura y muestra errores lanzados por las funciones (por ejemplo dimenciones incompatibles)
            cout << "\nError: " << e.what() << "\n";
        }

        // Esperar confirmación del usuario antes de regresar al menú
        // Consumir el resto de la línea si queda algo en el buffer
        cin.ignore(numeric_limits<streamsize>::max(), '\n');
        pausa_usuario();

        // Limpiar y volver a mostrar el banner/menu
        limpiar_pantalla();
        mostrar_banner();

    } while (opcion != 8);

    return 0;
}

// ------------------------- Historial (archivo JSON por línea) -------------------------

// Escapar comillas y barras en una cadena para JSON simple
string escape_json(const string& s) {
    string out;
    for (char c : s) {
        if (c == '\\') out += "\\\\";
        else if (c == '"') out += "\\\"";
        else out += c;
    }
    return out;
}

// Obtener timestamp ISO simple
string timestamp_now() {
    time_t t = time(nullptr);
    tm tmv;
#if defined(_WIN32) || defined(_WIN64)
    // MSVC provides localtime_s; MinGW may not — use localtime fallback there
    #if defined(__MINGW32__) || defined(__MINGW64__)
        tm* tmp = localtime(&t);
        if (tmp) tmv = *tmp; else tmv = tm();
    #else
        localtime_s(&tmv, &t);
    #endif
#else
    localtime_r(&t, &tmv);
#endif
    char buf[64];
    strftime(buf, sizeof(buf), "%Y-%m-%dT%H:%M:%S", &tmv);
    return string(buf);
}

// Registrar una operación en el historial (archivo `historial.log`)
void logOperacion(const string& tipo, const string& entradas, const string& resultado) {
    ofstream f("historial.log", ios::app);
    if (!f) return;
    string ts = timestamp_now();
    f << "{\"timestamp\":\"" << ts << "\",\"tipo\":\"" << escape_json(tipo)
      << "\",\"entradas\":\"" << escape_json(entradas)
      << "\",\"resultado\":\"" << escape_json(resultado) << "\"}" << "\n";
}

// Mostrar historial leyendo cada línea JSON y presentándola formateada
void mostrar_historial() {
    ifstream f("historial.log");
    if (!f) {
        cout << "No hay historial registrado.\n";
        return;
    }
    cout << "\nHistorial de operaciones:\n";
    string line;
    int i = 1;
    while (getline(f, line)) {
        if (line.empty()) continue;
        cout << i++ << ") " << line << "\n";
    }
}

// Limpiar historial (elimina o trunca el archivo)
void limpiar_historial() {
    ofstream f("historial.log", ios::trunc);
    // si no se puede abrir, no es crítico; simplemente informar
    if (!f) cout << "No se pudo limpiar historial (permiso o archivo en uso).\n";
    else cout << "Historial limpiado correctamente.\n";
}

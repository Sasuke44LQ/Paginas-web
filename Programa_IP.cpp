#include <iostream>
#include <string>
using namespace std;

const char* ASIGNATURAS[5] = {
    "Introduccion a la Programacion",
    "Introduccion a las Ciencias Informaticas",
    "Algebra Lineal",
    "Defensa Nacional",
    "Educacion Fisica"
};

const int NUM_ASIGNATURAS = 5;
const int MAX_GRUPOS = 100;

int totalAprobadosPorAsignatura(int aprobadosPorGrupo[][NUM_ASIGNATURAS], int numGrupos, int asignaturaIdx) {
    int total = 0;
    for (int i = 0; i < numGrupos; i++) {
        total += aprobadosPorGrupo[i][asignaturaIdx];
    }
    return total;
}

void asignaturasConMasAprobados(int aprobadosPorGrupo[][NUM_ASIGNATURAS], int numGrupos, int asignaturasMaxIdx[NUM_ASIGNATURAS], int &asignaturasMaxcont) {
    int totals[NUM_ASIGNATURAS] = {0};
    int maxv = -1;
    for (int j = 0; j < NUM_ASIGNATURAS; j++) {
        totals[j] = totalAprobadosPorAsignatura(aprobadosPorGrupo, numGrupos, j);
        if (totals[j] > maxv) maxv = totals[j];
    }
    asignaturasMaxcont = 0;
    for (int j = 0; j < NUM_ASIGNATURAS; j++) {
        if (totals[j] == maxv) {
            asignaturasMaxIdx[asignaturasMaxcont++] = j;
        }
    }
}

void grupoMenorPromocionIntro(int aprobadosPorGrupo[][NUM_ASIGNATURAS], int alumnosPorGrupo[], int numGrupos, int gruposMinIdx[], int &gruposMincont) {
    gruposMincont = 0;
    if (numGrupos <= 0) return;
    double minRate = 2.0; 
    
    for (int i = 0; i < numGrupos; i++) {
        int tot = alumnosPorGrupo[i];
        double rate;
        if (tot <= 0) rate = 1.0; 
        else rate = double(aprobadosPorGrupo[i][0]) / tot;
        if (rate < minRate) minRate = rate;
    }
    
    for (int i = 0; i < numGrupos; i++) {
        int tot = alumnosPorGrupo[i];
        double rate = (tot <= 0) ? 1.0 : double(aprobadosPorGrupo[i][0]) / tot;
        if (rate == minRate) {
            gruposMinIdx[gruposMincont++] = i;
        }
    }
}

void mostrarTabla(int aprobadosPorGrupo[][NUM_ASIGNATURAS], int alumnosPorGrupo[], int numGrupos) {
    cout << "\n=== TABLA DE APROBADOS ===\n";
    cout << "Grupo | Alumnos";
    for (int j = 0; j < NUM_ASIGNATURAS; j++) {
        cout << " | A" << (j+1);
    }
    cout << "\n";
    for (int i = 0; i < (7 + 4 + NUM_ASIGNATURAS * 4); i++) cout << "-";
    cout << "\n";
    
    for (int i = 0; i < numGrupos; i++) {
        cout << "G" << (i+1) << "    | " << alumnosPorGrupo[i];
        for (int j = 0; j < NUM_ASIGNATURAS; j++) {
            cout << " | " << aprobadosPorGrupo[i][j];
        }
        cout << "\n";
    }
    cout << "\n";
}

int leerEntero(const char* prompt, int minVal, int maxVal) {
    int x;
    while (true) {
        cout << prompt;
        cout.flush();
        if (!(cin >> x)) {
            cout << "Entrada invalida. Ingrese un numero.\n";
            cin.clear();
            cin.ignore(10000, '\n');
            continue;
        }
        if (x < minVal || x > maxVal) {
            cout << "Valor fuera de rango. Intente de nuevo.\n";
            continue;
        }
        return x;
    }
}

int main() {
    cout << "Informe de aprobados - Primer semestre\n";
    cout << "Asignaturas:\n";
    for (int i = 0; i < NUM_ASIGNATURAS; i++) cout << (i+1) << ") " << ASIGNATURAS[i] << "\n";

    int numGrupos = leerEntero("\nIngrese la cantidad de grupos (1-100): ", 1, MAX_GRUPOS);

    static int aprobadosPorGrupo[MAX_GRUPOS][NUM_ASIGNATURAS];
    static int alumnosPorGrupo[MAX_GRUPOS];

    for (int i = 0; i < numGrupos; i++) {
        cout << "\n--- Grupo " << (i+1) << " ---\n";
        int tot = leerEntero("Total de estudiantes en el grupo: ", 0, 10000);
        alumnosPorGrupo[i] = tot;
        for (int j = 0; j < NUM_ASIGNATURAS; j++) {
            int ap = leerEntero((string("Aprobados en ") + ASIGNATURAS[j] + ": ").c_str(), 0, tot);
            aprobadosPorGrupo[i][j] = ap;
        }
    }

    while (true) {
        cout << "\nMenu:\n";
        cout << "1) Total aprobados por asignatura\n";
        cout << "2) Asignatura(s) con mas aprobados\n";
        cout << "3) Grupo con menor promocion en Introduccion a la Programacion\n";
        cout << "4) Mostrar tabla de aprobados\n";
        cout << "5) Asignatura con mas aprobados\n";
        cout << "6) Salir\n";
        int opt = leerEntero("Elija una opcion: ", 1, 6);
        if (opt == 1) {
            int a = leerEntero("Elija asignatura (1-5): ", 1, NUM_ASIGNATURAS);
            int total = totalAprobadosPorAsignatura(aprobadosPorGrupo, numGrupos, a-1);
            cout << "Total aprobados en " << ASIGNATURAS[a-1] << " = " << total << "\n";
        } else if (opt == 2) {
            int asignaturasMaxIdx[NUM_ASIGNATURAS]; int asignaturasMaxcont = 0;
            asignaturasConMasAprobados(aprobadosPorGrupo, numGrupos, asignaturasMaxIdx, asignaturasMaxcont);
            if (asignaturasMaxcont == 0) cout << "No hay datos.\n";
            else {
                int t = totalAprobadosPorAsignatura(aprobadosPorGrupo, numGrupos, asignaturasMaxIdx[0]);
                cout << "Asignatura(s) con mas aprobados (" << t << " aprobados):\n";
                for (int k = 0; k < asignaturasMaxcont; k++) {
                    int idx = asignaturasMaxIdx[k];
                    cout << "  - " << ASIGNATURAS[idx] << "\n";
                }
            }
        } else if (opt == 3) {
            int gruposMinIdx[MAX_GRUPOS]; int gruposMincont = 0;
            grupoMenorPromocionIntro(aprobadosPorGrupo, alumnosPorGrupo, numGrupos, gruposMinIdx, gruposMincont);
            if (gruposMincont == 0) cout << "No hay grupos.\n";
            else if (gruposMincont == 1) {
                int idx = gruposMinIdx[0];
                int aprob = aprobadosPorGrupo[idx][0];
                int tot = alumnosPorGrupo[idx];
                double rate = (tot == 0) ? 0.0 : double(aprob) / tot * 100.0;
                cout << "Grupo con menor promocion: G" << (idx+1) << " -> " << aprob << "/" << tot << " (" << rate << "% )\n";
            } else {
                cout << "Hay varios grupos con la menor promocion:\n";
                for (int k = 0; k < gruposMincont; k++) {
                    int idx = gruposMinIdx[k];
                    int aprob = aprobadosPorGrupo[idx][0];
                    int tot = alumnosPorGrupo[idx];
                    double rate = (tot == 0) ? 0.0 : double(aprob) / tot * 100.0;
                    cout << "  - G" << (idx+1) << " -> " << aprob << "/" << tot << " (" << rate << "% )\n";
                }
            }
        } else if (opt == 4) {
            mostrarTabla(aprobadosPorGrupo, alumnosPorGrupo, numGrupos);
        } else if (opt == 5) {
            int asignaturasMaxIdx[NUM_ASIGNATURAS]; int asignaturasMaxcont = 0;
            asignaturasConMasAprobados(aprobadosPorGrupo, numGrupos, asignaturasMaxIdx, asignaturasMaxcont);
            if (asignaturasMaxcont == 0) cout << "No hay datos.\n";
            else {
                int t = totalAprobadosPorAsignatura(aprobadosPorGrupo, numGrupos, asignaturasMaxIdx[0]);
                if (asignaturasMaxcont == 1) {
                    cout << "Asignatura con mayor cantidad de aprobados: " << ASIGNATURAS[asignaturasMaxIdx[0]] << " (" << t << " aprobados)\n";
                } else {
                    cout << "Hay varias asignaturas con la mayor cantidad de aprobados (" << t << " aprobados):\n";
                    for (int k = 0; k < asignaturasMaxcont; k++) cout << "  - " << ASIGNATURAS[asignaturasMaxIdx[k]] << "\n";
                }
            }
        } else {
            cout << "Saliendo...\n";
            break;
        }
    }
    return 0;
}

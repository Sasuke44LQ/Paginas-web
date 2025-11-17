// Matrices_Jacobi.cpp
// Ejemplo sencillo del método iterativo de Jacobi para resolver Ax = b
// Comentarios explicativos añadidos; no se modifica la lógica del algoritmo.

#include <iostream>
#include <vector>
#include <cmath>

using namespace std;

/**
 * Método iterativo de Jacobi para resolver Ax = b.
 *
 * Parámetros:
 *  - A: matriz de coeficientes (n x n). Idealmente diagonalmente dominante para garantizar convergencia.
 *  - b: vector de términos independientes (n).
 *  - maxIter: número máximo de iteraciones.
 *  - tol: tolerancia para la convergencia (norma Euclidiana de la diferencia entre iteraciones).
 *
 * Retorno:
 *  - Vector x aproximado que resuelve A x = b.
 *
 * Observaciones:
 *  - Converge si A es estrictamente diagonalmente dominante o satisfacen condiciones de espectro.
 *  - Complejidad por iteración: O(n^2). Complejidad total: O(n^2 * maxIter).
 */
vector<double> metodoJacobi(const vector<vector<double>>& A, const vector<double>& b, int maxIter, double tol) {
    int n = A.size();
    vector<double> x(n, 0.0); // Solución inicial
    vector<double> xNuevo(n, 0.0); // Nueva solución

    for (int iter = 0; iter < maxIter; ++iter) {
        for (int i = 0; i < n; ++i) {
            double suma = 0.0;
            for (int j = 0; j < n; ++j) {
                if (i != j) {
                    suma += A[i][j] * x[j];
                }
            }
            xNuevo[i] = (b[i] - suma) / A[i][i];
        }

        // Comprobar la convergencia
        double norma = 0.0;
        for (int i = 0; i < n; ++i) {
            norma += pow(xNuevo[i] - x[i], 2);
        }
        norma = sqrt(norma);

        if (norma < tol) {
            break;
        }

        x = xNuevo; // Actualizar la solución
    }

    return xNuevo;
}

/**
 * Programa de ejemplo que utiliza el método de Jacobi.
 *
 * Flujo:
 *  - Lee la dimensión n, la matriz A y el vector b desde stdin.
 *  - Lee maxIter y tol, ejecuta `metodoJacobi` y muestra la solución.
 *
 * Uso típico:
 *  - Para probar, se puede introducir una matriz diagonalmente dominante para observar la convergencia.
 */
int main() {
    int n;
    cout << "Ingrese el número de ecuaciones: ";
    cin >> n;

    vector<vector<double>> A(n, vector<double>(n));
    vector<double> b(n);

    cout << "Ingrese la matriz de coeficientes A:" << endl;
    for (int i = 0; i < n; ++i) {
        for (int j = 0; j < n; ++j) {
            cin >> A[i][j];
        }
    }

    cout << "Ingrese el vector de términos independientes b:" << endl;
    for (int i = 0; i < n; ++i) {
        cin >> b[i];
    }

    int maxIter;
    double tol;
    cout << "Ingrese el número máximo de iteraciones: ";
    cin >> maxIter;
    cout << "Ingrese la tolerancia: ";
    cin >> tol;

    vector<double> solucion = metodoJacobi(A, b, maxIter, tol);

    cout << "La solución es:" << endl;
    for (int i = 0; i < n; ++i) {
        cout << "x[" << i << "] = " << solucion[i] << endl;
    }

    return 0;
}

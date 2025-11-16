#include <iostream>
#include <vector>
#include <iomanip>
#include <cmath>
#include <stdexcept>

using namespace std;

// Función para mostrar una matriz
void mostrarMatriz(const vector<vector<double>>& matriz) {
    for (const auto& fila : matriz) {
        for (double elemento : fila) {
            cout << setw(10) << setprecision(4) << fixed << elemento << " ";
        }
        cout << endl;
    }
}

// Sumar dos matrices
vector<vector<double>> sumarMatrices(const vector<vector<double>>& A, const vector<vector<double>>& B) {
    int filas = A.size();
    int columnas = A[0].size();
    vector<vector<double>> resultado(filas, vector<double>(columnas));

    for (int i = 0; i < filas; i++) {
        for (int j = 0; j < columnas; j++) {
            resultado[i][j] = A[i][j] + B[i][j];
        }
    }
    return resultado;
}

// Restar dos matrices
vector<vector<double>> restarMatrices(const vector<vector<double>>& A, const vector<vector<double>>& B) {
    int filas = A.size();
    int columnas = A[0].size();
    vector<vector<double>> resultado(filas, vector<double>(columnas));

    for (int i = 0; i < filas; i++) {
        for (int j = 0; j < columnas; j++) {
            resultado[i][j] = A[i][j] - B[i][j];
        }
    }
    return resultado;
}

// Multiplicar dos matrices
vector<vector<double>> multiplicarMatrices(const vector<vector<double>>& A, const vector<vector<double>>& B) {
    int filasA = A.size();
    int columnasA = A[0].size();
    int columnasB = B[0].size();
    vector<vector<double>> resultado(filasA, vector<double>(columnasB, 0));

    for (int i = 0; i < filasA; i++) {
        for (int j = 0; j < columnasB; j++) {
            for (int k = 0; k < columnasA; k++) {
                resultado[i][j] += A[i][k] * B[k][j];
            }
        }
    }
    return resultado;
}

// Transponer una matriz
vector<vector<double>> transponerMatriz(const vector<vector<double>>& matriz) {
    int filas = matriz.size();
    int columnas = matriz[0].size();
    vector<vector<double>> transpuesta(columnas, vector<double>(filas));

    for (int i = 0; i < filas; i++) {
        for (int j = 0; j < columnas; j++) {
            transpuesta[j][i] = matriz[i][j];
        }
    }
    return transpuesta;
}

// Método de Cramer para resolver sistemas de ecuaciones
vector<double> metodoCramer(const vector<vector<double>>& A, const vector<double>& b) {
    int n = A.size();
    double detA = 1.0; // Determinante de A
    vector<vector<double>> mat(A);

    // Calcular determinante de A usando eliminación de Gauss
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            double factor = mat[j][i] / mat[i][i];
            for (int k = i; k < n; k++) {
                mat[j][k] -= factor * mat[i][k];
            }
        }
        detA *= mat[i][i]; // Producto de los pivotes
    }

    if (detA == 0) {
        throw runtime_error("El sistema no tiene solución única.");
    }

    vector<double> x(n);
    for (int i = 0; i < n; i++) {
        vector<vector<double>> Ai = A;
        for (int j = 0; j < n; j++) {
            Ai[j][i] = b[j];
        }

        double detAi = 1.0;
        // Calcular determinante de Ai usando eliminación de Gauss
        mat = Ai;
        for (int j = 0; j < n; j++) {
            for (int k = j + 1; k < n; k++) {
                double factor = mat[k][j] / mat[j][j];
                for (int l = j; l < n; l++) {
                    mat[k][l] -= factor * mat[j][l];
                }
            }
            detAi *= mat[j][j]; // Producto de los pivotes
        }
        
        x[i] = detAi / detA;
    }

    return x;
}

// Método de Gauss para resolver sistemas de ecuaciones
vector<double> metodoGauss(vector<vector<double>> A, vector<double> b) {
    int n = A.size();
    // Eliminación hacia adelante
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            double factor = A[j][i] / A[i][i];
            for (int k = i; k < n; k++) {
                A[j][k] -= factor * A[i][k];
            }
            b[j] -= factor * b[i];
        }
    }

    // Sustitución hacia atrás
    vector<double> x(n);
    for (int i = n - 1; i >= 0; i--) {
        x[i] = b[i];
        for (int j = i + 1; j < n; j++) {
            x[i] -= A[i][j] * x[j];
        }
        x[i] /= A[i][i];
    }

    return x;
}

// Método de Gauss-Jordan para resolver sistemas de ecuaciones
vector<double> metodoGaussJordan(vector<vector<double>> Augmented) {
    int n = Augmented.size();
    
    // Eliminación hacia adelante
    for (int i = 0; i < n; i++) {
        // Normalizar la fila actual
        double pivot = Augmented[i][i];
        for (int j = 0; j <= n; j++) {
            Augmented[i][j] /= pivot;
        }
        
        // Eliminar las otras filas
        for (int j = 0; j < n; j++) {
            if (j != i) {
                double factor = Augmented[j][i];
                for (int k = 0; k <= n; k++) {
                    Augmented[j][k] -= factor * Augmented[i][k];
                }
            }
        }
    }

    // Extraer soluciones
    vector<double> x(n);
    for (int i = 0; i < n; i++) {
        x[i] = Augmented[i][n]; // La última columna es el resultado
    }

    return x;
}

// Método de Pivoteo para mejorar la estabilidad numérica
vector<double> metodoPivoteo(vector<vector<double>> A, vector<double> b) {
    int n = A.size();

    // Eliminación hacia adelante con pivoteo
    for (int i = 0; i < n; i++) {
        // Pivoteo
        double maxElem = abs(A[i][i]);
        int maxRow = i;
        for (int k = i + 1; k < n; k++) {
            if (abs(A[k][i]) > maxElem) {
                maxElem = abs(A[k][i]);
                maxRow = k;
            }
        }
        
        // Intercambiar filas
        swap(A[maxRow], A[i]);
        swap(b[maxRow], b[i]);

        // Eliminación hacia adelante
        for (int j = i + 1; j < n; j++) {
            double factor = A[j][i] / A[i][i];
            for (int k = i; k < n; k++) {
                A[j][k] -= factor * A[i][k];
            }
            b[j] -= factor * b[i];
        }
    }

    // Sustitución hacia atrás
    vector<double> x(n);
    for (int i = n - 1; i >= 0; i--) {
        x[i] = b[i];
        for (int j = i + 1; j < n; j++) {
            x[i] -= A[i][j] * x[j];
        }
        x[i] /= A[i][i];
    }

    return x;
}

void resolverSistemaEcuaciones() {
    int n;
    
    cout << "Ingrese el número de ecuaciones: ";
    cin >> n;

    vector<vector<double>> A(n, vector<double>(n));
    vector<double> b(n);

    cout << "Ingrese los coeficientes de la matriz A:" << endl;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            cin >> A[i][j];
        }
    }

    cout << "Ingrese los términos independientes b:" << endl;
    for (int i = 0; i < n; i++) {
        cin >> b[i];
    }

    cout << "\nMetodo de Cramer:\n";
    try {
        vector<double> solucionesCramer = metodoCramer(A, b);
        cout << "Soluciones: ";
        for (double sol : solucionesCramer) cout << sol << " ";
        cout << endl;
    } catch (const runtime_error& e) {
        cout << e.what() << endl;
    }

    cout << "\nMetodo de Gauss:\n";
    vector<double> solucionesGauss = metodoGauss(A, b);
    cout << "Soluciones: ";
    for (double sol : solucionesGauss) cout << sol << " ";
    cout << endl;

    cout << "\nMetodo de Gauss-Jordan:\n";
    vector<vector<double>> Augmented(n, vector<double>(n + 1));
    
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            Augmented[i][j] = A[i][j];
        }
        Augmented[i][n] = b[i];
    }

    vector<double> solucionesGaussJordan = metodoGaussJordan(Augmented);
    cout << "Soluciones: ";
    for (double sol : solucionesGaussJordan) cout << sol << " ";
    cout << endl;
    cout << "\nMetodo de Pivoteo:\n";
    vector<double> solucionesPivoteo = metodoPivoteo(A, b);
    cout << "Soluciones: ";
    for (double sol : solucionesPivoteo) cout << sol << " ";
    cout << endl;

}

// Función para resolver el sistema de ecuaciones usando el método de Jacobi
vector<double> metodoJacobi(const vector<vector<double>>& A, const vector<double>& b, int maxIter, double tol) {
    int n = A.size();
    vector<double> x(n, 0.0); // Solución inicial
    vector<double> xNuevo(n, 0.0); // Nueva solución

    for (int iter = 0; iter < maxIter; iter++) {
        for (int i = 0; i < n; i++) {
            double suma = 0.0;
            for (int j = 0; j < n; j++) {
                if (i != j) {
                    suma += A[i][j] * x[j];
                }
            }
            xNuevo[i] = (b[i] - suma) / A[i][i];
        }

        // Comprobar la convergencia
        double norma = 0.0;
        for (int i = 0; i < n; i++) {
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

int main() {
    int opcion;

    do {
        cout << "Menu de operaciones con matrices:" << endl;
        cout << "1. Sumar matrices" << endl;
        cout << "2. Restar matrices" << endl;
        cout << "3. Multiplicar matrices" << endl;
        cout << "4. Transponer matriz" << endl;
        cout << "5. Resolver sistema de ecuaciones" << endl;
        cout << "6. Salir" << endl;
        cout << "Seleccione una opcion: ";
        cin >> opcion;

        if (opcion == 1 || opcion == 2 || opcion == 3) {
            int filasA, columnasA, filasB, columnasB;

            cout << "Ingrese el numero de filas y columnas de la primera matriz: ";
            cin >> filasA >> columnasA;
            vector<vector<double>> A(filasA, vector<double>(columnasA));

            cout << "Ingrese los elementos de la primera matriz:" << endl;
            for (int i = 0; i < filasA; i++) {
                for (int j = 0; j < columnasA; j++) {
                    cin >> A[i][j];
                }
            }

            cout << "Ingrese el numero de filas y columnas de la segunda matriz: ";
            cin >> filasB >> columnasB;
            vector<vector<double>> B(filasB, vector<double>(columnasB));

            cout << "Ingrese los elementos de la segunda matriz:" << endl;
            for (int i = 0; i < filasB; i++) {
                for (int j = 0; j < columnasB; j++) {
                    cin >> B[i][j];
                }
            }

            if (opcion == 1 && filasA == filasB && columnasA == columnasB) {
                vector<vector<double>> resultado = sumarMatrices(A, B);
                cout << "Resultado de la suma:" << endl;
                mostrarMatriz(resultado);
            } else if (opcion == 2 && filasA == filasB && columnasA == columnasB) {
                vector<vector<double>> resultado = restarMatrices(A, B);
                cout << "Resultado de la resta:" << endl;
                mostrarMatriz(resultado);
            } else if (opcion == 3 && columnasA == filasB) {
                vector<vector<double>> resultado = multiplicarMatrices(A, B);
                cout << "Resultado de la multiplicacion:" << endl;
                mostrarMatriz(resultado);
            } else {
                cout << "Las dimensiones de las matrices no son compatibles para la operacion seleccionada." << endl;
            }
        } else if (opcion == 4) {
            int filas, columnas;

            cout << "Ingrese el numero de filas y columnas de la matriz: ";
            cin >> filas >> columnas;
            vector<vector<double>> matriz(filas, vector<double>(columnas));

            cout << "Ingrese los elementos de la matriz:" << endl;
            for (int i = 0; i < filas; i++) {
                for (int j = 0; j < columnas; j++) {
                    cin >> matriz[i][j];
                }
            }

            vector<vector<double>> transpuesta = transponerMatriz(matriz);
            cout << "Matriz transpuesta:" << endl;
            mostrarMatriz(transpuesta);
        } else if (opcion == 5) {
            resolverSistemaEcuaciones();
        }

        cout << endl;

    } while (opcion != 6);

    return 0;
}

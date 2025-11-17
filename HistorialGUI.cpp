// HistorialGUI.cpp
// Pequeña aplicación Win32 que muestra el contenido de `historial.log` en una lista
// Permite Actualizar, Limpiar historial y Cerrar.
// No requiere bibliotecas externas, compila con g++ (MinGW) o MSVC en Windows.

#include <windows.h>
#include <fstream>
#include <string>
#include <sstream>
#include <vector>

// IDs de controles
#define ID_LISTBOX 101
#define ID_BTN_REFRESH 102
#define ID_BTN_CLEAR 103
#define ID_BTN_EXIT 104

const wchar_t CLASS_NAME[] = L"HistorialGUIClass";

// Lee el archivo historial.log y devuelve las líneas
std::vector<std::wstring> leerHistorial() {
    std::vector<std::wstring> lines;
    std::wifstream f(L"historial.log");
    if (!f.is_open()) return lines;
    std::wstring line;
    while (std::getline(f, line)) {
        if (!line.empty()) lines.push_back(line);
    }
    return lines;
}

// Llena el listbox con las entradas del historial
void llenarListbox(HWND hwndList) {
    SendMessage(hwndList, LB_RESETCONTENT, 0, 0);
    auto lines = leerHistorial();
    for (size_t i = 0; i < lines.size(); ++i) {
        std::wstring entry = std::to_wstring(i+1) + L") " + lines[i];
        SendMessage(hwndList, LB_ADDSTRING, 0, (LPARAM)entry.c_str());
    }
}

// Borra el archivo historial.log
void limpiarHistorial() {
    std::ofstream f("historial.log", std::ios::trunc);
}

LRESULT CALLBACK WindowProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam) {
    static HWND hwndList = NULL;
    switch (uMsg) {
    case WM_CREATE: {
        // Crear controles
        hwndList = CreateWindowW(L"LISTBOX", NULL,
            WS_CHILD | WS_VISIBLE | WS_VSCROLL | LBS_HASSTRINGS,
            10, 10, 560, 300, hwnd, (HMENU)ID_LISTBOX, NULL, NULL);

        CreateWindowW(L"BUTTON", L"Actualizar",
            WS_CHILD | WS_VISIBLE,
            10, 320, 120, 30, hwnd, (HMENU)ID_BTN_REFRESH, NULL, NULL);

        CreateWindowW(L"BUTTON", L"Limpiar historial",
            WS_CHILD | WS_VISIBLE,
            140, 320, 140, 30, hwnd, (HMENU)ID_BTN_CLEAR, NULL, NULL);

        CreateWindowW(L"BUTTON", L"Salir",
            WS_CHILD | WS_VISIBLE,
            540, 320, 80, 30, hwnd, (HMENU)ID_BTN_EXIT, NULL, NULL);

        llenarListbox(hwndList);
        break;
    }
    case WM_COMMAND: {
        int id = LOWORD(wParam);
        if (id == ID_BTN_REFRESH) {
            llenarListbox(hwndList);
        } else if (id == ID_BTN_CLEAR) {
            limpiarHistorial();
            llenarListbox(hwndList);
        } else if (id == ID_BTN_EXIT) {
            PostMessage(hwnd, WM_CLOSE, 0, 0);
        }
        break;
    }
    case WM_DESTROY:
        PostQuitMessage(0);
        return 0;
    }
    return DefWindowProc(hwnd, uMsg, wParam, lParam);
}

int WINAPI wWinMain(HINSTANCE hInstance, HINSTANCE, PWSTR pCmdLine, int nCmdShow) {
    WNDCLASS wc = {};
    wc.lpfnWndProc = WindowProc;
    wc.hInstance = hInstance;
    wc.lpszClassName = CLASS_NAME;

    RegisterClass(&wc);

    HWND hwnd = CreateWindowEx(
        0,
        CLASS_NAME,
        L"Historial de Operaciones - Matrices",
        WS_OVERLAPPEDWINDOW,
        CW_USEDEFAULT, CW_USEDEFAULT, 600, 400,
        NULL,
        NULL,
        hInstance,
        NULL
    );

    if (hwnd == NULL) return 0;

    ShowWindow(hwnd, nCmdShow);

    // Bucle de mensajes
    MSG msg = {};
    while (GetMessage(&msg, NULL, 0, 0)) {
        TranslateMessage(&msg);
        DispatchMessage(&msg);
    }

    return 0;
}

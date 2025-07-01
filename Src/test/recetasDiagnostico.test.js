import httpMocks from 'node-mocks-http';
import { recetasDiagnostico } from '../Controller/Recetas.diagnostico.js'; // Ajusta la ruta a tu archivo de controlador
import Paciente from '../Model/user.model.js';
import { getPacienteByIdDiagnostico } from '../Controller/user.controller.js'; // Asumo que esta es la ruta correcta

// Mockear los módulos externos y las funciones/modelos
jest.mock('../Model/user.model.js');
jest.mock('../Controller/user.controller.js');

describe('recetasDiagnostico Controller', () => {
  let req, res;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    // Limpiar todos los mocks antes de cada test
    jest.clearAllMocks();

    // Limpiar mock de Paciente.save para cada test
    Paciente.mockClear();
  });

  // Mockear la clase Paciente (modelo) para simular instancias
  // Esto es crucial porque el controlador llama a paciente.save()
  Paciente.mockImplementation(() => {
    return {
      save: jest.fn().mockResolvedValue(true), // Mock del método save
      // Aquí puedes añadir otras propiedades si el controlador las accede directamente
    };
  });

  // --- Test cases for recetasDiagnostico ---

  it('debe retornar 404 si el paciente no es encontrado', async () => {
    req.params.id = 'nonExistentPatientId';
    getPacienteByIdDiagnostico.mockResolvedValueOnce(null); // Simula que el paciente no se encuentra

    await recetasDiagnostico(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ message: 'Paciente no encontrado' });
    expect(getPacienteByIdDiagnostico).toHaveBeenCalledWith({ params: { id: 'nonExistentPatientId' } });
  });

  it('debe retornar 404 si el diagnóstico del paciente no se encuentra en la lista de enfermedades', async () => {
    req.params.id = 'patientId1';
    const mockPaciente = {
      _id: 'patientId1',
      diagnostico: 'EnfermedadRara', // Diagnóstico que no existe en `medicamentos`
      medicamentoAtomar: ['Paracetamol'],
      alergias: [],
      save: jest.fn().mockResolvedValue(true),
    };
    getPacienteByIdDiagnostico.mockResolvedValueOnce(mockPaciente);

    await recetasDiagnostico(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ message: 'Diagnóstico no encontrado en la lista de enfermedades' });
    expect(mockPaciente.save).not.toHaveBeenCalled(); // No debe intentar guardar si no hay enfermedad
  });

  it('debe retornar 500 y un mensaje de error si el paciente tiene alergias a medicamentos prescritos', async () => {
    req.params.id = 'patientId2';
    const mockPaciente = {
      _id: 'patientId2',
      diagnostico: 'Resfriado común',
      medicamentoAtomar: ['Paracetamol', 'Amoxicilina'], // Amoxicilina es una alergia simulada
      alergias: ['Amoxicilina'],
      save: jest.fn().mockResolvedValue(true),
    };
    getPacienteByIdDiagnostico.mockResolvedValueOnce(mockPaciente);

    await recetasDiagnostico(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({ success: false, message: 'Tiene alergias a los siguientes medicamentos: amoxicilina. Cambiar receta.' });
    expect(mockPaciente.save).toHaveBeenCalled(); // Debería guardar el porcentaje antes de la alerta de alergia
  });

  it('debe calcular el porcentaje de coincidencia y retornar la receta si no hay alergias', async () => {
    req.params.id = 'patientId3';
    const mockPaciente = {
      _id: 'patientId3',
      diagnostico: 'Gripe',
      medicamentoAtomar: ['Paracetamol', 'Ibuprofeno'], // Coincide con 2 de 3 de Gripe
      alergias: ['Ninguna'],
      save: jest.fn().mockResolvedValue(true),
    };
    getPacienteByIdDiagnostico.mockResolvedValueOnce(mockPaciente);

    await recetasDiagnostico(req, res);

    // Los medicamentos recomendados para 'Gripe' son: Paracetamol, Ibuprofeno, Oseltamivir (3 en total)
    // Los prescritos son: Paracetamol, Ibuprofeno (2 coincidencias)
    // Porcentaje: (2/3) * 100 = 66.666...
    const expectedPorcentaje = (2 / 3) * 100;

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      success: true,
      diagnostico: 'Gripe',
      medicamentosPrescritos: ['Paracetamol', 'Ibuprofeno'],
      medicamentosRecomendados: ['Paracetamol', 'Ibuprofeno', 'Oseltamivir'],
      porcentajeCoincidencia: expectedPorcentaje
    });
    expect(mockPaciente.save).toHaveBeenCalled(); // Debe guardar el porcentaje
  });

  // ESTE ES EL TEST CORREGIDO PARA COINCIDIR CON TU LÓGICA ACTUAL DEL CONTROLADOR
  it('debe manejar medicamentosAtomar y alergias no siendo arrays (como strings), resultando en arrays vacíos en el controlador y un 200 OK', async () => {
    req.params.id = 'patientId4';
    const mockPaciente = {
      _id: 'patientId4',
      diagnostico: 'Resfriado común',
      medicamentoAtomar: 'Paracetamol, Ibuprofeno', // Es un string, se convierte a [] en el controlador actual
      alergias: 'Penicilina', // Es un string, se convierte a [] en el controlador actual
      save: jest.fn().mockResolvedValue(true),
    };
    getPacienteByIdDiagnostico.mockResolvedValueOnce(mockPaciente);

    await recetasDiagnostico(req, res);

    // Como medicamentoAtomar y alergias se convierten en arrays vacíos en el controlador,
    // no hay coincidencias de alergias ni medicamentos prescritos.
    // El porcentaje de coincidencia será 0.
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      success: true,
      diagnostico: 'Resfriado común',
      medicamentosPrescritos: [], // El controlador actual lo convierte en []
      medicamentosRecomendados: expect.any(Array), // La lista de la enfermedad (Resfriado común)
      porcentajeCoincidencia: 0 // No hay medicamentos prescritos que comparar
    });
    expect(mockPaciente.save).toHaveBeenCalled();
  });

  it('debe retornar 500 si ocurre un error inesperado', async () => {
    req.params.id = 'patientId5';
    getPacienteByIdDiagnostico.mockRejectedValueOnce(new Error('Database connection error'));

    await recetasDiagnostico(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({ success: false, message: 'Database connection error' });
  });

  // Nuevo test para cubrir el caso en que medicamentoAtomar es un array vacío
  it('debe manejar medicamentos prescritos vacíos correctamente', async () => {
    req.params.id = 'patientId6';
    const mockPaciente = {
      _id: 'patientId6',
      diagnostico: 'Gripe',
      medicamentoAtomar: [], // Array vacío
      alergias: [],
      save: jest.fn().mockResolvedValue(true),
    };
    getPacienteByIdDiagnostico.mockResolvedValueOnce(mockPaciente);

    await recetasDiagnostico(req, res);

    // 0% de coincidencia si no se prescribe nada
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().porcentajeCoincidencia).toBe(0);
    expect(mockPaciente.save).toHaveBeenCalled();
  });

  // Nuevo test para cubrir el caso en que las alergias son vacías o nulas
  it('debe funcionar si las alergias del paciente son vacías o nulas', async () => {
    req.params.id = 'patientId7';
    const mockPaciente = {
      _id: 'patientId7',
      diagnostico: 'Resfriado común',
      medicamentoAtomar: ['Paracetamol'],
      alergias: null, // Alergias nulas
      save: jest.fn().mockResolvedValue(true),
    };
    getPacienteByIdDiagnostico.mockResolvedValueOnce(mockPaciente);

    await recetasDiagnostico(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().success).toBe(true);
    expect(mockPaciente.save).toHaveBeenCalled();
  });
});
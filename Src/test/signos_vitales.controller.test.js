// Src/test/signos_vitales.controller.test.js

import httpMocks from 'node-mocks-http';
import {
  postSignosVitales,
  updateSignosVitales,
  getSignosVitalesIdDiagnostico,
  getSignosVitalesId,
  getSignosVitales
} from '../Controller/signos_vitales.controller.js';
import signos_vitalesModel from '../Model/signos_vitales.model.js';

// Mockear el modelo
jest.mock('../Model/signos_vitales.model.js');

// Suprimir console.log y console.error durante las pruebas
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

beforeAll(() => {
  console.log = jest.fn();
  console.error = jest.fn();
});

afterAll(() => {
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
});

describe('Signos Vitales Controller', () => {
  let req, res;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    jest.clearAllMocks();
  });

  // --- Tests para postSignosVitales ---
  describe('postSignosVitales', () => {
    it('debe registrar signos vitales exitosamente con todos los campos', async () => {
      const signosVitalesData = {
        id_paciente: 'paciente123',
        temperatura: '37.5',
        pulso: '80',
        presionArterial: '120/80',
        peso: '70',
        estatura: '175'
      };

      req.body = signosVitalesData;

      const mockSave = jest.fn().mockResolvedValue();
      signos_vitalesModel.mockImplementation(() => ({
        save: mockSave
      }));

      await postSignosVitales(req, res);

      expect(signos_vitalesModel).toHaveBeenCalledWith(signosVitalesData);
      expect(mockSave).toHaveBeenCalled();
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual({ message: "Signos vitales registrados exitosamente" });
    });

    it('debe registrar signos vitales con campos faltantes usando valores por defecto', async () => {
      const signosVitalesData = {
        id_paciente: 'paciente123',
        temperatura: '37.5'
        // otros campos faltantes
      };

      const expectedData = {
        id_paciente: 'paciente123',
        temperatura: '37.5',
        pulso: '',
        presionArterial: '',
        peso: '',
        estatura: ''
      };

      req.body = signosVitalesData;

      const mockSave = jest.fn().mockResolvedValue();
      signos_vitalesModel.mockImplementation(() => ({
        save: mockSave
      }));

      await postSignosVitales(req, res);

      expect(signos_vitalesModel).toHaveBeenCalledWith(expectedData);
      expect(mockSave).toHaveBeenCalled();
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual({ message: "Signos vitales registrados exitosamente" });
    });

    it('debe manejar errores al registrar signos vitales', async () => {
      const signosVitalesData = {
        id_paciente: 'paciente123',
        temperatura: '37.5'
      };

      req.body = signosVitalesData;

      const mockSave = jest.fn().mockRejectedValue(new Error('Error de base de datos'));
      signos_vitalesModel.mockImplementation(() => ({
        save: mockSave
      }));

      await postSignosVitales(req, res);

      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toEqual({ message: 'Error de base de datos' });
    });
  });

  // --- Tests para updateSignosVitales ---
  describe('updateSignosVitales', () => {
    it('debe actualizar todos los campos de signos vitales exitosamente', async () => {
      const pacienteId = 'paciente123';
      const updateData = {
        temperatura: '38.0',
        pulso: '85',
        presionArterial: '130/85',
        peso: '72',
        estatura: '175'
      };

      req.params.id = pacienteId;
      req.body = updateData;

      const mockUpdatedSignos = {
        id_paciente: pacienteId,
        ...updateData
      };

      signos_vitalesModel.findOneAndUpdate.mockResolvedValue(mockUpdatedSignos);

      await updateSignosVitales(req, res);

      expect(signos_vitalesModel.findOneAndUpdate).toHaveBeenCalledWith(
        { id_paciente: pacienteId },
        { $set: updateData },
        { new: true, runValidators: true }
      );
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual({ message: "Signos vitales actualizados exitosamente" });
    });

    it('debe actualizar solo los campos proporcionados', async () => {
      const pacienteId = 'paciente123';
      const updateData = {
        temperatura: '38.0',
        pulso: '85'
        // otros campos no incluidos
      };

      req.params.id = pacienteId;
      req.body = updateData;

      const mockUpdatedSignos = {
        id_paciente: pacienteId,
        temperatura: '38.0',
        pulso: '85'
      };

      signos_vitalesModel.findOneAndUpdate.mockResolvedValue(mockUpdatedSignos);

      await updateSignosVitales(req, res);

      expect(signos_vitalesModel.findOneAndUpdate).toHaveBeenCalledWith(
        { id_paciente: pacienteId },
        { $set: { temperatura: '38.0', pulso: '85' } },
        { new: true, runValidators: true }
      );
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual({ message: "Signos vitales actualizados exitosamente" });
    });

    it('debe manejar campos undefined sin incluirlos en la actualización', async () => {
      const pacienteId = 'paciente123';
      const updateData = {
        temperatura: '38.0',
        pulso: undefined,
        presionArterial: '130/85',
        peso: undefined,
        estatura: undefined
      };

      req.params.id = pacienteId;
      req.body = updateData;

      const expectedUpdateData = {
        temperatura: '38.0',
        presionArterial: '130/85'
      };

      signos_vitalesModel.findOneAndUpdate.mockResolvedValue({ id_paciente: pacienteId });

      await updateSignosVitales(req, res);

      expect(signos_vitalesModel.findOneAndUpdate).toHaveBeenCalledWith(
        { id_paciente: pacienteId },
        { $set: expectedUpdateData },
        { new: true, runValidators: true }
      );
      expect(res.statusCode).toBe(200);
    });

    it('debe retornar 404 cuando el paciente no existe', async () => {
      const pacienteId = 'pacienteInexistente';
      req.params.id = pacienteId;
      req.body = { temperatura: '38.0' };

      signos_vitalesModel.findOneAndUpdate.mockResolvedValue(null);

      await updateSignosVitales(req, res);

      expect(res.statusCode).toBe(404);
      expect(res._getJSONData()).toEqual({ message: "Paciente no encontrado" });
    });

    it('debe manejar errores en la actualización', async () => {
      const pacienteId = 'paciente123';
      req.params.id = pacienteId;
      req.body = { temperatura: '38.0' };

      signos_vitalesModel.findOneAndUpdate.mockRejectedValue(new Error('Error de validación'));

      await updateSignosVitales(req, res);

      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toEqual({ message: 'Error de validación' });
    });
  });

  // --- Tests para getSignosVitalesIdDiagnostico ---
  describe('getSignosVitalesIdDiagnostico', () => {
    it('debe retornar signos vitales por id de paciente exitosamente', async () => {
      const pacienteId = 'paciente123';
      const mockSignosVitales = {
        id_paciente: pacienteId,
        temperatura: '37.5',
        pulso: '80',
        presionArterial: '120/80',
        peso: '70',
        estatura: '175'
      };

      req.params.id = pacienteId;
      signos_vitalesModel.findOne.mockResolvedValue(mockSignosVitales);

      const result = await getSignosVitalesIdDiagnostico(req);

      expect(signos_vitalesModel.findOne).toHaveBeenCalledWith({ id_paciente: pacienteId });
      expect(result).toEqual(mockSignosVitales);
    });

    it('debe lanzar error cuando falla la consulta', async () => {
      const pacienteId = 'paciente123';
      req.params.id = pacienteId;

      signos_vitalesModel.findOne.mockRejectedValue(new Error('Error de conexión'));

      await expect(getSignosVitalesIdDiagnostico(req)).rejects.toThrow('Error de conexión');
    });

    it('debe retornar null cuando no encuentra signos vitales', async () => {
      const pacienteId = 'pacienteInexistente';
      req.params.id = pacienteId;

      signos_vitalesModel.findOne.mockResolvedValue(null);

      const result = await getSignosVitalesIdDiagnostico(req);

      expect(result).toBeNull();
    });
  });

  // --- Tests para getSignosVitalesId ---
  describe('getSignosVitalesId', () => {
    it('debe retornar signos vitales por id exitosamente', async () => {
      const pacienteId = 'paciente123';
      const mockSignosVitales = {
        id_paciente: pacienteId,
        temperatura: '37.5',
        pulso: '80'
      };

      req.params.id = pacienteId;
      signos_vitalesModel.findOne.mockResolvedValue(mockSignosVitales);

      await getSignosVitalesId(req, res);

      expect(signos_vitalesModel.findOne).toHaveBeenCalledWith({ id_paciente: pacienteId });
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual(mockSignosVitales);
    });

    it('debe lanzar error cuando falla la consulta en getSignosVitalesId', async () => {
      const pacienteId = 'paciente123';
      req.params.id = pacienteId;

      signos_vitalesModel.findOne.mockRejectedValue(new Error('Error de base de datos'));

      await expect(getSignosVitalesId(req, res)).rejects.toThrow('Error de base de datos');
    });

    it('debe retornar null cuando no encuentra signos vitales por id', async () => {
      const pacienteId = 'pacienteInexistente';
      req.params.id = pacienteId;

      signos_vitalesModel.findOne.mockResolvedValue(null);

      await getSignosVitalesId(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toBeNull();
    });
  });

  // --- Tests para getSignosVitales ---
  describe('getSignosVitales', () => {
    it('debe retornar todos los signos vitales exitosamente', async () => {
      const mockSignosVitales = [
        {
          id_paciente: 'paciente1',
          temperatura: '37.5',
          pulso: '80'
        },
        {
          id_paciente: 'paciente2',
          temperatura: '36.8',
          pulso: '75'
        }
      ];

      signos_vitalesModel.find.mockResolvedValue(mockSignosVitales);

      await getSignosVitales(req, res);

      expect(signos_vitalesModel.find).toHaveBeenCalledWith();
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual(mockSignosVitales);
    });

    it('debe retornar array vacío cuando no hay signos vitales', async () => {
      signos_vitalesModel.find.mockResolvedValue([]);

      await getSignosVitales(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual([]);
    });

    it('debe manejar errores al obtener todos los signos vitales', async () => {
      signos_vitalesModel.find.mockRejectedValue(new Error('Error de consulta'));

      await getSignosVitales(req, res);

      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toEqual({ message: 'Error de consulta' });
    });
  });

  // --- Tests adicionales para casos edge ---
  describe('Casos edge adicionales', () => {
    it('debe manejar body vacío en postSignosVitales', async () => {
      req.body = { id_paciente: 'paciente123' };

      const expectedData = {
        id_paciente: 'paciente123',
        temperatura: '',
        pulso: '',
        presionArterial: '',
        peso: '',
        estatura: ''
      };

      const mockSave = jest.fn().mockResolvedValue();
      signos_vitalesModel.mockImplementation(() => ({
        save: mockSave
      }));

      await postSignosVitales(req, res);

      expect(signos_vitalesModel).toHaveBeenCalledWith(expectedData);
      expect(res.statusCode).toBe(200);
    });

    it('debe manejar body vacío en updateSignosVitales', async () => {
      const pacienteId = 'paciente123';
      req.params.id = pacienteId;
      req.body = {};

      signos_vitalesModel.findOneAndUpdate.mockResolvedValue({ id_paciente: pacienteId });

      await updateSignosVitales(req, res);

      expect(signos_vitalesModel.findOneAndUpdate).toHaveBeenCalledWith(
        { id_paciente: pacienteId },
        { $set: {} },
        { new: true, runValidators: true }
      );
      expect(res.statusCode).toBe(200);
    });

    it('debe manejar valores falsy pero válidos en updateSignosVitales', async () => {
      const pacienteId = 'paciente123';
      req.params.id = pacienteId;
      req.body = {
        temperatura: '0',
        pulso: '',
        peso: '0'
      };

      const expectedData = {
        temperatura: '0',
        pulso: '',
        peso: '0'
      };

      signos_vitalesModel.findOneAndUpdate.mockResolvedValue({ id_paciente: pacienteId });

      await updateSignosVitales(req, res);

      expect(signos_vitalesModel.findOneAndUpdate).toHaveBeenCalledWith(
        { id_paciente: pacienteId },
        { $set: expectedData },
        { new: true, runValidators: true }
      );
      expect(res.statusCode).toBe(200);
    });
  });
});
// user.controller.test.js

import {
  createPaciente,
  getPacientesD,
  getPacientes,
  updatePacienteById,
  updatePacienteByIdSintomasAlergias,
  updatePacienteByIdMedicamentosAtomar,
  getPacientesByDoctorId,
  getPacienteByIdDiagnostico,
  getPacienteById,
  deletePacienteById,
} from "../Controller/user.controller.js";
import Paciente from "../Model/user.model.js";

// Mock del modelo Paciente
jest.mock("../Model/user.model.js");

describe("User Controller Tests", () => {
  let req, res;

  beforeEach(() => {
    // Reset de mocks antes de cada test
    jest.clearAllMocks();

    // Mock de req y res
    req = {
      body: {},
      params: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe("createPaciente", () => {
    it("debería crear un paciente exitosamente con todos los campos", async () => {
      const pacienteData = {
        id_doctor: "doc123",
        nombres: "Juan",
        apellidos: "Pérez",
        email: "juan@test.com",
        cedula: "1234567890",
        edad: 30,
        contacto_emergencia: "0987654321",
        motivo_consulta: "Dolor de cabeza",
        sintomas: ["dolor", "fiebre"],
        alergias: ["penicilina"],
        diagnostico: "Migraña",
        medicamentoAtomar: "Ibuprofeno",
      };

      req.body = pacienteData;

      const mockSave = jest.fn().mockResolvedValue();
      Paciente.mockImplementation(() => ({
        save: mockSave,
      }));

      await createPaciente(req, res);

      expect(Paciente).toHaveBeenCalledWith({
        id_doctor: "doc123",
        nombres: "Juan",
        apellidos: "Pérez",
        email: "juan@test.com",
        cedula: "1234567890",
        edad: 30,
        contacto_emergencia: "0987654321",
        motivo_consulta: "Dolor de cabeza",
        sintomas: ["dolor", "fiebre"],
        alergias: ["penicilina"],
        diagnostico: "Migraña",
        medicamentoAtomar: "Ibuprofeno",
      });
      expect(mockSave).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Paciente creado exitosamente",
      });
    });

    it("debería crear un paciente con arrays vacíos cuando sintomas y alergias no son arrays", async () => {
      req.body = {
        id_doctor: "doc123",
        nombres: "Ana",
        apellidos: "García",
        email: "ana@test.com",
        cedula: "0987654321",
        edad: 25,
        contacto_emergencia: "1234567890",
        motivo_consulta: "Consulta general",
        sintomas: "dolor",
        alergias: "ninguna",
      };

      const mockSave = jest.fn().mockResolvedValue();
      Paciente.mockImplementation(() => ({
        save: mockSave,
      }));

      await createPaciente(req, res);

      expect(Paciente).toHaveBeenCalledWith(
        expect.objectContaining({
          sintomas: [],
          alergias: [],
          diagnostico: "",
          medicamentoAtomar: "",
        })
      );
    });

    it("debería manejar errores durante la creación", async () => {
      req.body = {
        id_doctor: "doc123",
        nombres: "Error",
        apellidos: "Test",
      };

      const mockSave = jest
        .fn()
        .mockRejectedValue(new Error("Error de base de datos"));
      Paciente.mockImplementation(() => ({
        save: mockSave,
      }));

      await expect(createPaciente(req, res)).rejects.toThrow(
        "Error de base de datos"
      );
    });
  });

  describe("getPacientesD", () => {
    it("debería retornar todos los pacientes exitosamente", async () => {
      const mockPacientes = [
        { _id: "1", nombres: "Juan", apellidos: "Pérez" },
        { _id: "2", nombres: "Ana", apellidos: "García" },
      ];

      Paciente.find.mockResolvedValue(mockPacientes);

      const result = await getPacientesD();

      expect(Paciente.find).toHaveBeenCalled();
      expect(result).toEqual(mockPacientes);
    });

    it("debería propagar errores al obtener pacientes", async () => {
      Paciente.find.mockRejectedValue(new Error("Error de base de datos"));

      await expect(getPacientesD()).rejects.toThrow("Error de base de datos");
    });
  });

  describe("getPacientes", () => {
    it("debería retornar todos los pacientes con respuesta HTTP", async () => {
      const mockPacientes = [
        { _id: "1", nombres: "Juan", apellidos: "Pérez" },
      ];

      Paciente.find.mockResolvedValue(mockPacientes);

      await getPacientes(req, res);

      expect(Paciente.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockPacientes);
    });

    it("debería manejar errores con respuesta HTTP", async () => {
      Paciente.find.mockRejectedValue(new Error("Error de conexión"));

      await getPacientes(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Error de conexión" });
    });
  });

  describe("updatePacienteById", () => {
    beforeEach(() => {
      req.params.id = "paciente123";
    });

    it("debería actualizar un paciente exitosamente", async () => {
      req.body = {
        nombres: "Juan Actualizado",
        cedula: "1111111111",
        email: "nuevo@email.com",
        sintomas: ["dolor actualizado"],
        alergias: ["alergia nueva"],
      };

      const mockPacienteActualizado = { _id: "paciente123", ...req.body };

      Paciente.findOne
        .mockResolvedValueOnce(null) // No existe cédula duplicada
        .mockResolvedValueOnce(null); // No existe email duplicado

      Paciente.findByIdAndUpdate.mockResolvedValue(mockPacienteActualizado);

      await updatePacienteById(req, res);

      expect(Paciente.findByIdAndUpdate).toHaveBeenCalledWith(
        "paciente123",
        expect.objectContaining({
          sintomas: ["dolor actualizado"],
          alergias: ["alergia nueva"],
        }),
        { new: true }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockPacienteActualizado);
    });

    it("debería rechazar actualización si la cédula ya existe", async () => {
      req.body = { cedula: "1234567890" };

      const pacienteExistente = { _id: "otroPaciente", cedula: "1234567890" };
      Paciente.findOne.mockResolvedValueOnce(pacienteExistente);

      await updatePacienteById(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "La cédula ya está en uso",
      });
    });

    it("debería rechazar actualización si el email ya existe", async () => {
      req.body = {
        cedula: "1234567890",
        email: "existente@email.com",
      };

      const pacienteExistente = {
        _id: "otroPaciente",
        email: "existente@email.com",
      };
      Paciente.findOne
        .mockResolvedValueOnce(null) // Cédula OK
        .mockResolvedValueOnce(pacienteExistente); // Email duplicado

      await updatePacienteById(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "El email ya está en uso",
      });
    });

    it("debería permitir actualización si cédula y email pertenecen al mismo paciente", async () => {
      req.body = {
        cedula: "1234567890",
        email: "mismo@email.com",
        sintomas: "dolor",
        alergias: "ninguna",
      };

      const mismoPaciente = { _id: "paciente123", cedula: "1234567890" };
      const mockActualizado = { _id: "paciente123", ...req.body };

      Paciente.findOne
        .mockResolvedValueOnce(mismoPaciente) // Misma cédula, mismo ID
        .mockResolvedValueOnce(mismoPaciente); // Mismo email, mismo ID

      Paciente.findByIdAndUpdate.mockResolvedValue(mockActualizado);

      await updatePacienteById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockActualizado);
    });

    it("debería retornar 404 si el paciente no existe", async () => {
      req.body = { nombres: "Test" };

      Paciente.findOne.mockResolvedValue(null);
      Paciente.findByIdAndUpdate.mockResolvedValue(null);

      await updatePacienteById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Paciente no encontrado" });
    });

    it("debería convertir sintomas y alergias a arrays", async () => {
      req.body = {
        sintomas: "dolor único",
        alergias: "alergia única",
      };

      Paciente.findOne.mockResolvedValue(null);
      Paciente.findByIdAndUpdate.mockResolvedValue({ _id: "paciente123" });

      await updatePacienteById(req, res);

      expect(Paciente.findByIdAndUpdate).toHaveBeenCalledWith(
        "paciente123",
        expect.objectContaining({
          sintomas: ["dolor único"],
          alergias: ["alergia única"],
        }),
        { new: true }
      );
    });
  });

  describe("updatePacienteByIdSintomasAlergias", () => {
    beforeEach(() => {
      req.params.id = "paciente123";
    });

    it("debería actualizar síntomas y alergias exitosamente", async () => {
      req.body = {
        sintomas: ["nuevo síntoma"],
        alergias: ["nueva alergia"],
      };

      const mockPaciente = { _id: "paciente123", ...req.body };
      Paciente.findByIdAndUpdate.mockResolvedValue(mockPaciente);

      await updatePacienteByIdSintomasAlergias(req, res);

      expect(Paciente.findByIdAndUpdate).toHaveBeenCalledWith(
        "paciente123",
        expect.objectContaining({
          sintomas: ["nuevo síntoma"],
          alergias: ["nueva alergia"],
        }),
        { new: true }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockPaciente);
    });

    it("debería convertir valores únicos a arrays", async () => {
      req.body = {
        sintomas: "síntoma único",
        alergias: "alergia única",
      };

      Paciente.findByIdAndUpdate.mockResolvedValue({ _id: "paciente123" });

      await updatePacienteByIdSintomasAlergias(req, res);

      expect(Paciente.findByIdAndUpdate).toHaveBeenCalledWith(
        "paciente123",
        expect.objectContaining({
          sintomas: ["síntoma único"],
          alergias: ["alergia única"],
        }),
        { new: true }
      );
    });

    it("debería retornar 404 si el paciente no existe", async () => {
      req.body = { sintomas: ["test"] };
      Paciente.findByIdAndUpdate.mockResolvedValue(null);

      await updatePacienteByIdSintomasAlergias(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Paciente no encontrado" });
    });
  });

  describe("updatePacienteByIdMedicamentosAtomar", () => {
    beforeEach(() => {
      req.params.id = "paciente123";
    });

    it("debería actualizar medicamentos exitosamente", async () => {
      req.body = {
        medicamentoAtomar: ["Ibuprofeno", "Paracetamol"],
      };

      const mockPaciente = { _id: "paciente123", ...req.body };
      Paciente.findByIdAndUpdate.mockResolvedValue(mockPaciente);

      await updatePacienteByIdMedicamentosAtomar(req, res);

      expect(Paciente.findByIdAndUpdate).toHaveBeenCalledWith(
        "paciente123",
        expect.objectContaining({
          medicamentoAtomar: ["Ibuprofeno", "Paracetamol"],
        }),
        { new: true }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockPaciente);
    });

    it("debería convertir medicamento único a array", async () => {
      req.body = {
        medicamentoAtomar: "Aspirina",
      };

      Paciente.findByIdAndUpdate.mockResolvedValue({ _id: "paciente123" });

      await updatePacienteByIdMedicamentosAtomar(req, res);

      expect(Paciente.findByIdAndUpdate).toHaveBeenCalledWith(
        "paciente123",
        expect.objectContaining({
          medicamentoAtomar: ["Aspirina"],
        }),
        { new: true }
      );
    });

    it("debería retornar 404 si el paciente no existe", async () => {
      req.body = { medicamentoAtomar: ["test"] };
      Paciente.findByIdAndUpdate.mockResolvedValue(null);

      await updatePacienteByIdMedicamentosAtomar(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Paciente no encontrado" });
    });
  });

  describe("getPacientesByDoctorId", () => {
    beforeEach(() => {
      req.params.id = "doctor123";
    });

    it("debería obtener pacientes por ID del doctor exitosamente", async () => {
      const mockPacientes = [
        { _id: "1", id_doctor: "doctor123", nombres: "Juan" },
        { _id: "2", id_doctor: "doctor123", nombres: "Ana" },
      ];

      Paciente.find.mockResolvedValue(mockPacientes);

      await getPacientesByDoctorId(req, res);

      expect(Paciente.find).toHaveBeenCalledWith({ id_doctor: "doctor123" });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockPacientes);
    });

    it("debería manejar errores al obtener pacientes por doctor", async () => {
      Paciente.find.mockRejectedValue(new Error("Error de consulta"));

      await getPacientesByDoctorId(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Error de consulta" });
    });
  });

  describe("getPacienteByIdDiagnostico", () => {
    beforeEach(() => {
      req.params.id = "paciente123";
    });

    it("debería obtener paciente por ID para diagnóstico exitosamente", async () => {
      const mockPaciente = { _id: "paciente123", nombres: "Juan" };
      Paciente.findById.mockResolvedValue(mockPaciente);

      const result = await getPacienteByIdDiagnostico(req, res);

      expect(Paciente.findById).toHaveBeenCalledWith("paciente123");
      expect(result).toEqual(mockPaciente);
    });

    it("debería lanzar error si el paciente no existe", async () => {
      Paciente.findById.mockResolvedValue(null);

      await expect(getPacienteByIdDiagnostico(req, res)).rejects.toThrow(
        "Paciente no encontrado"
      );
    });
  });

  describe("getPacienteById", () => {
    beforeEach(() => {
      req.params.id = "paciente123";
    });

    it("debería obtener paciente por ID exitosamente", async () => {
      const mockPaciente = { _id: "paciente123", nombres: "Juan" };
      Paciente.findById.mockResolvedValue(mockPaciente);

      await getPacienteById(req, res);

      expect(Paciente.findById).toHaveBeenCalledWith("paciente123");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockPaciente);
    });

    it("debería lanzar error si el paciente no existe", async () => {
      Paciente.findById.mockResolvedValue(null);

      await expect(getPacienteById(req, res)).rejects.toThrow(
        "Paciente no encontrado"
      );
    });
  });

  describe("deletePacienteById", () => {
    beforeEach(() => {
      req.body.cedula = "1234567890";
    });

    it("debería eliminar paciente exitosamente", async () => {
      const mockPaciente = { _id: "paciente123", cedula: "1234567890" };
      Paciente.findOneAndDelete.mockResolvedValue(mockPaciente);

      await deletePacienteById(req, res);

      expect(Paciente.findOneAndDelete).toHaveBeenCalledWith({
        cedula: "1234567890",
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Paciente eliminado exitosamente",
      });
    });

    it("debería retornar 404 si el paciente no existe", async () => {
      Paciente.findOneAndDelete.mockResolvedValue(null);

      await deletePacienteById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Paciente no encontrado" });
    });
  });
});
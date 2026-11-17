import { validateTripForm, type CreateTripForm } from "./tripFormValidation";

const startDate = new Date("2026-11-17T00:00:00.000Z");
const endDate = new Date("2026-11-20T00:00:00.000Z");

function makeForm(overrides: Partial<CreateTripForm> = {}): CreateTripForm {
  return {
    name: "Viaje de verano",
    destination: "Bogotá",
    startDate,
    endDate,
    ...overrides,
  };
}

describe("validateTripForm", () => {
  it("returns no errors when all fields are valid", () => {
    expect(validateTripForm(makeForm())).toEqual({
      name: null,
      destination: null,
      endDate: null,
    });
  });

  it("requires a non-blank name and destination", () => {
    expect(
      validateTripForm(makeForm({ name: "   ", destination: "" })),
    ).toEqual({
      name: "required",
      destination: "required",
      endDate: null,
    });
  });

  it("accepts the maximum text length and rejects longer values", () => {
    expect(
      validateTripForm(makeForm({ name: "Á".repeat(15) })).name,
    ).toBeNull();
    expect(validateTripForm(makeForm({ name: "Á".repeat(16) })).name).toBe(
      "textTooLong",
    );
  });

  it("rejects characters outside the allowed trip text", () => {
    expect(
      validateTripForm(makeForm({ destination: "Paris!" })).destination,
    ).toBe("invalidCharacters");
  });

  it("rejects an end date earlier than the start date", () => {
    expect(
      validateTripForm(
        makeForm({ endDate: new Date("2026-11-16T00:00:00.000Z") }),
      ).endDate,
    ).toBe("invalidDates");
  });
});

import React, { useState, useEffect } from "react";
import { Radio, Table, Input, Select, Collapse } from "antd";
import api from "../api";

function Home() {
  const [view, setView] = useState(1);

  const statuses = [
    "Move To Client Money",
    "Supplier Instructed",
    "Booked",
    "Awaiting Certificate",
  ];

  const sampleData = [
    {
      id: 1,
      property: "Flat A",
      compliance: "Gas Safety Certificate",
      status: "Supplier Instructed",
      dueDate: "2026-07-01",
    },
    {
      id: 2,
      property: "Flat B",
      compliance: "EICR",
      status: "Booked",
      dueDate: "2026-08-15",
    },
    {
      id: 3,
      property: "Flat C",
      compliance: "EPC",
      status: "Supplier Instructed",
      dueDate: "2026-07-15",
    },
  ];

  const [compliances, setCompliances] = useState([]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const data = await api.getCompliances();
        if (mounted && Array.isArray(data)) setCompliances(data);
        else if (mounted) setCompliances(sampleData);
      } catch (e) {
        if (mounted) setCompliances(sampleData);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    setCompliances((prev) => prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item)));
    try {
      await api.updateCompliance(id, { status: newStatus });
    } catch (e) {
      // keep optimistic update; optionally notify user
    }
  };

  const handleChange = async (id, field, value) => {
    setCompliances((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
    try {
      await api.updateCompliance(id, { [field]: value });
    } catch (e) {
      // optimistic update kept
    }
  };

  const addCompliance = async (status) => {
    const payload = { property: "", compliance: "", dueDate: "", status };
    try {
      const created = await api.addCompliance(payload);
      setCompliances((prev) => [...prev, created]);
    } catch (e) {
      setCompliances((prev) => [...prev, { id: Date.now(), ...payload }]);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteCompliance(id);
      setCompliances((prev) => prev.filter((item) => item.id !== id));
    } catch (e) {
      setCompliances((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="h-screen w-full p-4">
      <div className="flex items-center justify-between border px-4 py-2 mb-4">
        <span>Compliance</span>

        <input
          type="text"
          placeholder="Search..."
          className="border px-2 py-1"
        />
      </div>

      <div className="h-[85vh] w-full border flex flex-col">
        <div className="flex items-center justify-end mb-4 px-4 py-2 flex-wrap">
          <Radio.Group value={view} onChange={(e) => setView(e.target.value)}>
            <Radio value={1}>List</Radio>
            <Radio value={2}>Card</Radio>
          </Radio.Group>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-2">
          {view === 1 ? (
            <>
              {statuses.map((status) => {
                const items = compliances.filter(
                  (item) => item.status === status,
                );

                return (
                  <div key={status} className="mb-6">
                    <div className="font-bold text-lg border-b pb-2 mb-2">
                      {status} ({items.length})
                    </div>

                    <div className="grid grid-cols-5 gap-4 font-semibold border-b py-2">
                      <div>Status</div>
                      <div>Property</div>
                      <div>Certificate</div>
                      <div>Due Date</div>
                      <div>Action</div>
                    </div>

                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="grid grid-cols-5 gap-4 py-2 border-b items-center hover:bg-gray-50"
                      >
                        <select
                          value={item.status}
                          onChange={(e) =>
                            handleStatusChange(item.id, e.target.value)
                          }
                          className="border rounded px-2 py-1"
                        >
                          {statuses.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>

                        <div>
                          <input
                            value={item.property}
                            onChange={(e) =>
                              handleChange(item.id, "property", e.target.value)
                            }
                            className="w-full border-none outline-none"
                          />
                        </div>
                        <div>
                          <input
                            value={item.compliance}
                            onChange={(e) =>
                              handleChange(
                                item.id,
                                "compliance",
                                e.target.value,
                              )
                            }
                            className="w-full border-none outline-none"
                          />
                        </div>
                        <div>
                          <input
                            type="date"
                            value={item.dueDate}
                            onChange={(e) =>
                              handleChange(item.id, "dueDate", e.target.value)
                            }
                            className="w-full border-none outline-none"
                          />
                        </div>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addCompliance(status)}
                      className="mt-2 text-blue-500"
                    >
                      + Add Compliance
                    </button>
                  </div>
                );
              })}
            </>
          ) : (
            <div>Card View</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;

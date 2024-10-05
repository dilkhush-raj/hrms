import { useState, useEffect, useCallback } from "react";
import axios from "axios";

interface CalendarLeave {
  id: string;
  user: {
    name: string;
  };
  date: string;
}

export default function LeaveCalendar() {
  const [leaves, setLeaves] = useState<CalendarLeave[]>([]);
  // const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const formatDate = (isoDate: string) => {
    if (!isoDate) return "";
    return new Date(isoDate).toISOString().split("T")[0];
  };

  const apiUrl = `${
    import.meta.env.VITE_BACKEND_HOST_URL
  }/api/v1/leave/calendar`;

  const fetchLeaves = useCallback(
    async (date?: string) => {
      setIsLoading(true);
      try {
        const url = date ? `${apiUrl}?date=${date}` : apiUrl;
        const response = await axios.get(url, {
          withCredentials: true,
        });

        if (response.status === 200) {
          setLeaves(response.data.leaves);
          console.log(response);
        }
      } catch (error) {
        console.error("Error fetching leave calendar:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [apiUrl]
  );

  useEffect(() => {
    fetchLeaves(undefined);
  }, [fetchLeaves]);

  // const handleTodayClick = () => {
  //   const today = new Date().toISOString().split("T")[0];
  //   setSelectedDate(today);
  // };

  // const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setSelectedDate(event.target.value);
  // };

  // const clearDateFilter = () => {
  //   setSelectedDate(null);
  // };

  return (
    <div className="container mx-auto p-4">
      {/* <div className="mb-4 flex items-center space-x-4">
        <button
          onClick={handleTodayClick}
          className="bg-[#6B46C1] text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Today's Leaves
        </button>
        <input
          type="date"
          value={selectedDate || ""}
          onChange={handleDateChange}
          className="border rounded px-3 py-2"
        />
        {selectedDate && (
          <button
            onClick={clearDateFilter}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Clear Filter
          </button>
        )}
      </div> */}

      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="bg-white shadow rounded-lg">
          <h3 className="bg-[#6B46C1] text-white px-4 py-3 rounded-t-3xl">
            Leave Calender
          </h3>
          <div className="px-4 py-5 sm:p-6">
            {/* <h3 className="text-lg leading-6 font-medium text-gray-900">
              {selectedDate
                ? `Approved Leaves for ${formatDate(selectedDate)}`
                : "All Approved Leaves"}
            </h3> */}
            <div className="mt-5">
              {leaves.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {leaves.map((leave) => (
                    <li key={leave.id} className="py-4">
                      <div className="flex justify-between">
                        <div className="text-sm font-medium text-gray-900">
                          {leave?.user?.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(leave.date)}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No approved leaves found.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

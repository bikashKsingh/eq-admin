import { DataTable, GoBackButton, Pagination } from "../../components";
import {
  Column,
  HeaderProps,
  Row,
  TableInstance,
  useFilters,
  usePagination,
  useRowSelect,
  useSortBy,
  useTable,
} from "react-table";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import { deleteConfirmation, get, remove } from "../../utills";
import { toast } from "react-toastify";
import { useGoogleLogin } from "@react-oauth/google";
import { setDate } from "date-fns";

export function CalendarList() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [status, setStatus] = useState<boolean | string>("");
  const [needReload, setNeedReload] = useState<boolean>(false);
  const [records, setRecords] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalRecords: 0,
    totalPages: 0,
  });

  // Extend the TableInstance type
  type TableInstanceWithRowSelect<T extends object> = TableInstance<T> & {
    selectedFlatRows: Row<T>[];
  };

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const accessToken = tokenResponse.access_token;
      console.log("Token:", tokenResponse);

      setLoading(true);
      await getCalendarEvents(accessToken);
      setLoading(false);
    },
    scope: "https://www.googleapis.com/auth/calendar",
  });

  type Record = {
    id: any;
    start: string;
    end: string;
    status: any;
    eventType: any;
    summary: any;
  };

  const columns: Column<Record>[] = React.useMemo(
    () => [
      {
        id: "selection",
        disableSortBy: true,
        Header: ({ getToggleAllRowsSelectedProps }: any) => (
          <div>
            <input type="checkbox" {...getToggleAllRowsSelectedProps()} />
          </div>
        ),
        Cell: ({ row }: any) => (
          <div>
            <input type="checkbox" {...row.getToggleRowSelectedProps()} />
          </div>
        ),
      },

      {
        Header: "SUMMARY",
        accessor: "summary",
        disableSortBy: true,
      },
      {
        Header: "START",
        accessor: "start",
        disableSortBy: true,
        Cell: ({ value }: any) => {
          if (value) {
            return value;
          } else {
            return null;
          }
        },
      },

      {
        Header: "END",
        accessor: "end",
        disableSortBy: true,
        Cell: ({ value }: any) => {
          if (value) {
            return value;
          } else {
            return null;
          }
        },
      },

      // {
      //   Header: "CREATED AT",
      //   accessor: "createdAt",
      //   Cell: ({ value }: any) => {
      //     return moment(new Date(value)).format("DD-MM-YYYY");
      //   },
      // },
      // {
      //   Header: "attendees",
      //   accessor: "attendees",
      //   Cell: ({ value }: any) => {
      //     return value.length;
      //   },
      // },
      {
        Header: "EVENT TYPE",
        accessor: "eventType",
        Cell: ({ value }: any) => {
          return value;
        },
      },
      {
        Header: "STATUS",
        accessor: "status",
        Cell: ({ value }: any) => {
          return value;
        },
      },
      {
        Header: "ACTION",
        accessor: "id",
        disableSortBy: true,
        Cell: ({ value }: any) => {
          return (
            <div className="d-flex gap-1">
              <Link
                className="p-2 bg-light"
                to={{
                  pathname: `/categories/edit/${value}`,
                }}
              >
                <span className="fas fa-pencil-alt" aria-hidden="true"></span>
              </Link>

              <button
                type="button"
                className="btn p-2 bg-light"
                data-toggle="modal"
                data-target="#deleteModal"
                onClick={() => {
                  handleDeleteData(value);
                }}
              >
                <span
                  className="fas fa-trash-alt text-danger"
                  aria-hidden="true"
                ></span>
              </button>
            </div>
          );
        },
      },
    ],
    []
  );

  const data = React.useMemo(() => {
    return records.map((data) => {
      return {
        id: data.id,
        start: data.start.dateTime,
        end: data.end.dateTime,
        summary: data.summary,
        eventType: data.eventType,
        status: data.status,
      };
    });
  }, [records]);

  const { getTableProps, headerGroups, rows, prepareRow, selectedFlatRows } =
    useTable(
      { columns, data },
      useFilters,
      useSortBy,
      usePagination,
      useRowSelect

      // Use a custom hook to add selection functionality
      // (hooks) => {
      //   hooks.visibleColumns.push((columns) => [
      //     {
      //       id: "selection",
      //       disableSortBy: true,
      //       Header: ({ getToggleAllRowsSelectedProps }) => (
      //         <div>
      //           <input type="checkbox" {...getToggleAllRowsSelectedProps()} />
      //         </div>
      //       ),
      //       Cell: ({ row }) => (
      //         <div>
      //           <input type="checkbox" {...row.getToggleRowSelectedProps()} />
      //         </div>
      //       ),
      //     },
      //     ...columns,
      //   ]);
      // }
    ) as TableInstanceWithRowSelect<Record>;

  // handleDeleteData
  async function handleDeleteData(recordId: string | string[]) {
    const { isConfirmed } = await deleteConfirmation();

    if (!isConfirmed) {
      return;
    }

    let apiResponse = null;
    if (Array.isArray(recordId)) {
      apiResponse = await remove(`/categories`, recordId);
    } else {
      apiResponse = await remove(`/categories/${recordId}`);
    }

    if (apiResponse?.status == 200) {
      toast.success(apiResponse?.message);
      setNeedReload((old) => {
        return !old;
      });
    } else {
      toast.error(apiResponse?.message);
    }
  }

  function handleSelectedRows(): string[] {
    const selectedData = selectedFlatRows.map((row: any) => row?.original?.id);
    return selectedData;
  }

  // handleSetStatus
  function handleSetStatus(evt: React.ChangeEvent<HTMLInputElement>) {
    setStatus(evt.target.value);
  }

  const getCalendarEvents = async (accessToken: string) => {
    try {
      const response = await fetch("http://localhost:5500/api/v1/calendars", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: accessToken,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to create calendar event:", errorData);
        return false;
      }

      const responseData = await response.json();
      // console.log("Calendar event created successfully:", );
      setRecords(responseData?.data?.items);
      return true;
    } catch (error) {
      console.error("There was an error sending the request:", error);
      return false;
    }
  };

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-md-12 grid-margin">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex gap-2">
              <GoBackButton />
              <h4 className="font-weight-bold mb-0">Category List</h4>
            </div>
            <div>
              <button
                type="button"
                className="btn btn-primary text-light"
                onClick={() => {
                  login();
                }}
              >
                Load Data
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12 grid-margin stretch-card ">
          <div className="card rounded-2">
            <div className="card-body shadow-none">
              <div className="row mb-2 gy-2">
                <div className="col-8">
                  <input
                    placeholder="Serach..."
                    className="form-control py-2"
                    type="serach"
                    onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
                      setSearchQuery(evt.target.value)
                    }
                  />
                </div>
                <div className="col-4 d-flex gap-2 justify-content-md-end">
                  {/* <button className="btn p-2 bg-light border">
                    <i className="ti-search"></i>
                  </button> */}
                  {selectedFlatRows.length ? (
                    <button
                      className="btn p-2 bg-light border"
                      onClick={() => {
                        handleDeleteData(handleSelectedRows());
                      }}
                    >
                      <i className="fas fa-trash-alt text-danger"></i>
                    </button>
                  ) : null}

                  <div className="dropdown">
                    <a
                      className="btn p-2 bg-light border"
                      href="#"
                      role="button"
                      id="dropdownMenuLink"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="ti-filter"></i>
                    </a>

                    <ul
                      className="dropdown-menu"
                      aria-labelledby="dropdownMenuLink"
                    >
                      <li className="d-flex px-3 gap-2">
                        <input
                          type="radio"
                          id="all"
                          value={"All"}
                          name="status"
                          onChange={handleSetStatus}
                        />
                        <label htmlFor="all">All</label>
                      </li>
                      <li className="d-flex px-3 gap-2">
                        <input
                          type="radio"
                          id="active"
                          value={"true"}
                          name="status"
                          onChange={handleSetStatus}
                        />
                        <label htmlFor="active">Active</label>
                      </li>
                      <li className="d-flex px-3 gap-2">
                        <input
                          type="radio"
                          id="disabled"
                          value={"false"}
                          name="status"
                          onChange={handleSetStatus}
                        />
                        <label htmlFor="disabled">Disabled</label>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="table-responsive">
                {/* Data Table */}
                <DataTable
                  getTableBodyProps={getTableProps}
                  getTableProps={getTableProps}
                  headerGroups={headerGroups}
                  rows={rows}
                  prepareRow={prepareRow}
                />
                {/* Pagination */}
                <Pagination
                  pagination={pagination}
                  setPagination={setPagination}
                  tableName={"table-to-xls"}
                  csvFileName={"coupons"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

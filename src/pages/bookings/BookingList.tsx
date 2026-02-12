import {
  CustomSelect,
  DataTable,
  GoBackButton,
  Pagination,
} from "../../components";
import {
  Column,
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
import { Link } from "react-router-dom";
import { deleteConfirmation, get, BOOKING_STATUS, remove } from "../../utills";
import { toast } from "react-toastify";
import { DateRangePicker } from "react-date-range";
import { enUS } from "date-fns/locale";

// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

export function BookingList() {
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [status, setStatus] = useState<boolean | string>("");
  const [needReload, setNeedReload] = useState<boolean>(false);
  const [records, setRecords] = useState<any[]>([]);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  const [isCalendarVisible, setCalendarVisible] = useState(false);

  const [bookingStatus, setBookingStatus] = useState([
    {
      label: "BOOKED",
      value: "BOOKED",
    },
    {
      label: "CANCELLED",
      value: "CANCELLED",
    },
    {
      label: "ACTIVE",
      value: "ACTIVE",
    },
    {
      label: "EXPIRED",
      value: "EXPIRED",
    },
    {
      label: "ALL",
      value: "",
    },
  ]);

  const [selectedBookingStatus, setSelectedBookingStatus] = useState<{
    label: string;
    value: string;
  } | null>(null);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalRecords: 0,
    totalPages: 0,
  });

  // Get Data From Database
  useEffect(
    function () {
      async function getData() {
        setLoading(true);
        let url = `/bookings?page=${pagination.page}&limit=${pagination.limit}`;
        if (searchQuery) url += `&searchQuery=${searchQuery}`;
        if (status) url += `&status=${status}`;
        if (selectedBookingStatus)
          url += `&bookingStatus=${selectedBookingStatus.value}`;

        const apiResponse = await get(url, true);

        if (apiResponse?.status == 200) {
          setRecords(apiResponse.body);
          setPagination({
            ...pagination,
            page: apiResponse?.page as number,
            totalPages: apiResponse?.totalPages as number,
            totalRecords: apiResponse?.totalRecords as number,
          });
        } else {
          setRecords([]);
          toast.error(apiResponse?.message);
        }
        setLoading(false);
      }

      getData();
    },
    [
      pagination.page,
      pagination.limit,
      searchQuery,
      needReload,
      status,
      selectedBookingStatus,
    ]
  );

  type Record = {
    program: string;
    plan: string;
    user: string;
    bookingDate: string;
    activationDate: string;
    bookingStatus: boolean;
    id: string;
  };

  // Extend the TableInstance type
  type TableInstanceWithRowSelect<Record extends object> =
    TableInstance<Record> & {
      selectedFlatRows: Row<Record>[];
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
      // {
      //   Header: "",
      //   accessor: "defaultImage",
      //   disableSortBy: true,
      //   Cell: ({ value }: any) => {
      //     return (
      //       <div>
      //         <img className="img" src={value} />
      //       </div>
      //     );
      //   },
      // },
      {
        Header: "USER NAME",
        accessor: "user",
      },
      {
        Header: "PROGRAM",
        accessor: "program",
      },

      {
        Header: "PLAN",
        accessor: "plan",
      },
      {
        Header: "BOOKING DATE",
        accessor: "bookingDate",
        Cell: ({ value }: any) => {
          return moment(new Date(value)).format("DD-MM-YYYY");
        },
      },

      {
        Header: "ACTIVATION DATE",
        accessor: "activationDate",
        Cell: ({ value }: any) => {
          return value
            ? moment(new Date(value)).format("DD-MM-YYYY")
            : "Not Available";
        },
      },
      {
        Header: "STATUS",
        accessor: "bookingStatus",
        Cell: ({ value }: any) => {
          const bookingStatus: BOOKING_STATUS = value;
          return (
            <>
              {bookingStatus == "BOOKED" ? (
                <span className="badge bg-info">Booked</span>
              ) : bookingStatus == "CANCELLED" ? (
                <span className="badge bg-danger">Cancelled</span>
              ) : bookingStatus == "ACTIVE" ? (
                <span className="badge bg-success">Active</span>
              ) : bookingStatus == "EXPIRED" ? (
                <span className="badge bg-warning">Expired</span>
              ) : null}
            </>
          );
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
                  pathname: `/bookings/edit/${value}`,
                }}
              >
                <span className="fas fa-pencil-alt" aria-hidden="true"></span>
              </Link>

              <Link
                className="p-2 bg-light"
                to={{
                  pathname: `/bookings/details/${value}`,
                }}
              >
                <span
                  className="fas fa-eye text-warning"
                  aria-hidden="true"
                ></span>
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
        program: data?.program?.name,
        plan: data?.plan?.name,
        user: `${data?.user?.firstName} ${data?.user?.lastName}`,
        bookingDate: data.createdAt,
        activationDate: data.activationDate,
        bookingStatus: data.bookingStatus,
        id: data._id,
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
    ) as TableInstanceWithRowSelect<Record>;

  // handleDeleteData
  async function handleDeleteData(recordId: string | string[]) {
    const { isConfirmed } = await deleteConfirmation();

    if (!isConfirmed) {
      return;
    }

    let apiResponse = null;
    if (Array.isArray(recordId)) {
      apiResponse = await remove(`/bookings`, recordId);
    } else {
      apiResponse = await remove(`/bookings/${recordId}`);
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

  function handleSelectDateRange(ranges: any) {
    setSelectionRange(ranges.selection);
  }

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-md-12 grid-margin">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex gap-2">
              <GoBackButton />
              <h4 className="font-weight-bold mb-0">Bookings</h4>
            </div>
            <div>
              {/* <Link
                to={"/bookings/add"}
                type="button"
                className="btn btn-primary text-light"
              >
                Add Program
              </Link> */}
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12 grid-margin stretch-card ">
          <div className="card rounded-2">
            <div className="card-body shadow-none">
              <div className="row mb-2 gy-2">
                <div className="col-md-6">
                  {/* <input
                    placeholder="Serach..."
                    className="form-control py-2"
                    type="serach"
                    onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
                      setSearchQuery(evt.target.value)
                    }
                  /> */}

                  {/* Display selected date range */}
                  <div
                    style={{
                      marginTop: "10px",
                      fontSize: "16px",
                    }}
                    onClick={() => {
                      setCalendarVisible(!isCalendarVisible);
                    }}
                  >
                    <p
                      className="px-3 py-1"
                      style={{
                        display: "inline-block",
                        boxShadow: "0px 1px 1px #5a5a5a",
                        borderRadius: "5px",
                      }}
                    >
                      <i className="ti-calendar"></i>{" "}
                      {`${selectionRange.startDate.toDateString()} - ${selectionRange.endDate.toDateString()}`}
                    </p>
                  </div>

                  {isCalendarVisible && (
                    <div
                      style={{
                        marginTop: "10px",
                        position: "absolute",
                        left: "20px",
                        background: "white",
                        padding: "10px",
                        boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                        borderRadius: "8px",
                        zIndex: 10,
                      }}
                    >
                      <DateRangePicker
                        ranges={[selectionRange]}
                        onChange={(ranges) => {
                          handleSelectDateRange(ranges);
                        }}
                        locale={enUS}
                        minDate={new Date("2024-01-01")}
                        maxDate={new Date("2028-12-31")}
                        direction="horizontal"
                        editableDateInputs={true}
                        scroll={{ enabled: false }}
                        dateDisplayFormat="dd/MM/yyyy"
                        rangeColors={["#4caf50"]} // Customize the highlight color
                      />

                      <div className="d-flex gap-2 justify-content-end">
                        <div className="">
                          <button
                            className="btn btn-danger p-2"
                            onClick={() => {
                              setCalendarVisible(false); // Close calendar
                              console.log(
                                "Selected Date Range:",
                                selectionRange
                              );
                            }}
                          >
                            Cancel
                          </button>
                        </div>

                        {/* Apply Button */}
                        {/* <div className="">
                          <button
                            className="btn btn-success p-2"
                            onClick={() => {
                              setCalendarVisible(false);
                              console.log(
                                "Selected Date Range:",
                                selectionRange
                              );
                            }}
                          >
                            Apply
                          </button>
                        </div> */}
                      </div>
                    </div>
                  )}
                </div>
                <div className="col-md-6 d-flex gap-2 justify-content-md-end">
                  <div className="p-0">
                    <CustomSelect
                      label=""
                      placeholder="Booking Status"
                      name="bookingStats"
                      required={false}
                      options={bookingStatus}
                      value={selectedBookingStatus}
                      error={""}
                      touched={false}
                      handleChange={(value) => {
                        setSelectedBookingStatus(value);
                      }}
                      handleBlur={() => {}}
                      inputPadding={"0px 0px"}
                    />
                  </div>

                  {/* <button className="btn p-2 bg-light border">
                    <i className="ti-search"></i>
                  </button> */}
                  {selectedFlatRows.length ? (
                    <div className="">
                      <button
                        className="btn p-2 bg-light border"
                        onClick={() => {
                          handleDeleteData(handleSelectedRows());
                        }}
                      >
                        <i className="fas fa-trash-alt text-danger"></i>
                      </button>
                    </div>
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
                          value={"ALL"}
                          name="status"
                          onChange={handleSetStatus}
                        />
                        <label htmlFor="all">All</label>
                      </li>
                      <li className="d-flex px-3 gap-2">
                        <input
                          type="radio"
                          id="active"
                          value={"SUBSCRIBED"}
                          name="status"
                          onChange={handleSetStatus}
                        />
                        <label htmlFor="active">Subscribed</label>
                      </li>
                      <li className="d-flex px-3 gap-2">
                        <input
                          type="radio"
                          id="disabled"
                          value={"UNSUBSCRIBED"}
                          name="status"
                          onChange={handleSetStatus}
                        />
                        <label htmlFor="disabled">Unsubscribed</label>
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

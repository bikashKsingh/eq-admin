import { GoBackButton, Pagination } from "../../components";
import { useEffect, useState } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import { deleteConfirmation, get, put, remove } from "../../utills";
import { toast } from "react-toastify";

export function CustomerStoryList() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [status, setStatus] = useState<boolean | string>("ALL");
  const [needReload, setNeedReload] = useState<boolean>(false);
  const [records, setRecords] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    totalRecords: 0,
    totalPages: 0,
  });

  useEffect(
    function () {
      async function getData() {
        let url = `/customerStories?page=${pagination.page}&limit=${pagination.limit}`;
        if (searchQuery) url += `&searchQuery=${searchQuery}`;
        if (status) url += `&status=${status}`;
        url += "&displayOrder=ASC";

        const apiResponse = await get(url, true);
        if (apiResponse?.status == 200) {
          setRecords(apiResponse.body);
          setSelectedIds([]);
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
      }

      getData();
    },
    [pagination.page, pagination.limit, searchQuery, needReload, status],
  );

  async function handleDeleteData(recordId: string | string[]) {
    const { isConfirmed } = await deleteConfirmation();

    if (!isConfirmed) {
      return;
    }

    const apiResponse = Array.isArray(recordId)
      ? await remove(`/customerStories`, recordId)
      : await remove(`/customerStories/${recordId}`);

    if (apiResponse?.status == 200) {
      toast.success(apiResponse?.message);
      setNeedReload((old) => !old);
    } else {
      toast.error(apiResponse?.message);
    }
  }

  function handleSetStatus(evt: React.ChangeEvent<HTMLInputElement>) {
    setStatus(evt.target.value);
  }

  function toggleSelected(id: string, checked: boolean) {
    setSelectedIds((old) => {
      if (checked) return [...old, id];
      return old.filter((selectedId) => selectedId !== id);
    });
  }

  async function handleUpdateStatus(id: string, value: boolean) {
    const apiResponse = await put(`/customerStories/${id}`, { status: value });
    if (apiResponse?.status == 200) {
      toast.success(apiResponse?.message);
      setNeedReload((old) => !old);
    } else {
      toast.error(apiResponse?.message);
    }
  }

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-md-12 grid-margin">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex gap-2">
              <GoBackButton />
              <h4 className="font-weight-bold mb-0">Customer Stories</h4>
            </div>
            <Link
              to={"/customerStories/add"}
              type="button"
              className="btn btn-primary text-light"
            >
              Add Customer Story
            </Link>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12 grid-margin stretch-card">
          <div className="card rounded-2">
            <div className="card-body shadow-none">
              <div className="row mb-3 gy-2">
                <div className="col-md-8">
                  <input
                    placeholder="Search..."
                    className="form-control py-2"
                    type="search"
                    onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
                      setSearchQuery(evt.target.value)
                    }
                  />
                </div>
                <div className="col-md-4 d-flex gap-2 justify-content-md-end">
                  {selectedIds.length ? (
                    <button
                      className="btn p-2 bg-light border"
                      onClick={() => {
                        handleDeleteData(selectedIds);
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

                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                      <li className="d-flex px-3 gap-2">
                        <input
                          type="radio"
                          id="all"
                          value={"ALL"}
                          name="status"
                          checked={status === "ALL"}
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
                          checked={status === "true"}
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
                          checked={status === "false"}
                          onChange={handleSetStatus}
                        />
                        <label htmlFor="disabled">Disabled</label>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {records.length ? (
                <div className="row g-3">
                  {records.map((record) => (
                    <div className="col-sm-6 col-lg-4 col-xl-3" key={record._id}>
                      <div className="card rounded-2 h-100 border">
                        <div
                          className="position-relative bg-light"
                          style={{ aspectRatio: "4 / 5", overflow: "hidden" }}
                        >
                          <input
                            type="checkbox"
                            className="form-check-input position-absolute m-2"
                            style={{ zIndex: 2 }}
                            checked={selectedIds.includes(record._id)}
                            onChange={(evt) =>
                              toggleSelected(record._id, evt.target.checked)
                            }
                          />

                          {record.mediaType === "video" ? (
                            <video
                              src={record.mediaUrl}
                              controls
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <img
                              src={record.mediaUrl}
                              alt={record.customerName || "Customer story"}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          )}
                        </div>

                        <div className="card-body p-3">
                          <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                            <div>
                              <h6 className="mb-1">
                                {record.customerName || "Customer Story"}
                              </h6>
                              <small className="text-muted">
                                Order {record.displayOrder} | {record.mediaType}
                              </small>
                            </div>
                            <div className="form-check form-switch">
                              <input
                                className="form-check-input custom-switch"
                                type="checkbox"
                                role="switch"
                                checked={record.status === true}
                                onChange={(evt) => {
                                  handleUpdateStatus(record._id, evt.target.checked);
                                }}
                              />
                            </div>
                          </div>

                          {record.title ? (
                            <p className="text-muted small mb-2">{record.title}</p>
                          ) : null}

                          <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted">
                              {moment(new Date(record.createdAt)).format("DD-MM-YYYY")}
                            </small>
                            <div className="d-flex gap-1">
                              <Link
                                className="p-2 bg-light"
                                to={`/customerStories/edit/${record._id}`}
                              >
                                <span
                                  className="fas fa-pencil-alt"
                                  aria-hidden="true"
                                ></span>
                              </Link>

                              <button
                                type="button"
                                className="btn p-2 bg-light"
                                onClick={() => {
                                  handleDeleteData(record._id);
                                }}
                              >
                                <span
                                  className="fas fa-trash-alt text-danger"
                                  aria-hidden="true"
                                ></span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted py-5">
                  No customer stories found.
                </div>
              )}

              <Pagination
                pagination={pagination}
                setPagination={setPagination}
                tableName={"customer-story-grid"}
                csvFileName={"customer-stories"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

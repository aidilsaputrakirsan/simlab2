import { useEffect, useRef, useState } from "react"
import { TahunAkademikApi } from "../../../api/TahunAkademikApi"
import type { TahunAkademik } from "../../../types/TahunAkademik"
import Icon from "@mdi/react"
import { mdiPlus } from "@mdi/js"
import Swal from "sweetalert2"
import Modal from "../../../components/Modal"
import Table from "../../../components/Table"

const TahunAkademikPage = () => {
  const token = localStorage.getItem('token')
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  const [tahunAkademik, setTahunAkademik] = useState<TahunAkademik[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("created_at")
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>("desc")

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editData, setEditData] = useState<number | null>(null)

  const [modalType, setModalType] = useState<'Add' | 'Edit'>('Add')

  const tahunAkademikFields = [
    {
      name: 'academic_year',
      label: 'Tahun Akademik',
      type: 'text' as const,
      placeholder: 'e.g. 2023/2024',
      required: true,
      // Custom validator example
      // validator: (value: string) => {
      //   const pattern = /^\d{4}\/\d{4}$/;
      //   return pattern.test(value) ? null : 'Format should be YYYY/YYYY';
      // }
    }
  ];

  const tahunAkademikColumn = [

    { header: 'Tahun Akademik', accessor: 'academic_year' as keyof TahunAkademik, sortable: true },
    {
      header: 'Status',
      accessor: 'status' as keyof TahunAkademik,
      sortable: true,
      cellRenderer: (status: 'Active' | 'Deactive', item: TahunAkademik) => (
        <span className={`px-2 py-1 rounded-lg ${status === 'Active' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} transition-colors duration-200 cursor-pointer text-white`} onClick={() => handleStatusChange(item.id)}>{status}</span>
      )
    },

    {
      header: 'Action',
      accessor: 'id' as keyof TahunAkademik,
      sortable: true,
      cellRenderer: (value:number, item:TahunAkademik) => (
        <>
          <button className="mr-2 text-indigo-600 hover:text-indigo-900" onClick={() => openEditModal(item.id)}>
            Edit
          </button>
          <button className="text-red-600 hover:text-red-900" onClick={() => handleDelete(item.id)}>
            Delete
          </button>
        </>
      )
    },
  ];

  const fetchData = async () => {
    if (!token) return

    setLoading(true)
    try {
      const response = await TahunAkademikApi.getData(token, {
        page: currentPage,
        per_page: perPage,
        search: searchTerm,
        sort_by: sortBy,
        sort_direction: sortDirection
      })

      setTahunAkademik(response.data.data)
      setTotalPages(response.data.last_page)
      setTotalItems(response.data.total)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [currentPage, perPage, sortBy, sortDirection])

  // Debounce search to prevent excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage === 1) {
        fetchData()
      } else {
        setCurrentPage(1) // This will trigger fetchData via the dependency array
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  // Modal handlers
  const openAddModal = () => {
    setModalType('Add')
    setEditData(null)
    setIsModalOpen(true)
  }

  const openEditModal = (id: number) => {
    setModalType('Edit')
    setEditData(id)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditData(null)
  }

  const handleSave = async (data: TahunAkademik) => {
    if (!token) return
    try {
      let res
      if (editData) {
        // Update existing record
        res = await TahunAkademikApi.updateData(token, editData, data)
      } else {
        // Create new record
        res = await TahunAkademikApi.createData(token, data)
      }

      await Swal.fire({
        title: "Success!",
        text: res?.message,
        icon: "success"
      });
      closeModal()
      fetchData()
    } catch (error) {
      console.error("Error saving data:", error)
    }
  }

  const handleDelete = (id: number) => {
    if (!token) return

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await TahunAkademikApi.deleteData(token, id)
          Swal.fire({
            title: "Deleted!",
            text: response.message,
            icon: "success"
          });
          setLoading(true)
          fetchData()
        } catch (error) {
          console.error("Error deleting data:", error)
        } finally {
          setLoading(false)
        }
      }
    });
  }

  const handleStatusChange = (id: number) => {
    if (!token) return

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await TahunAkademikApi.toggleStatus(token, id)
          Swal.fire({
            title: "Success!",
            text: response.message,
            icon: "success"
          });
          setLoading(true)
          fetchData()
        } catch (error) {
          console.error("Error deleting data:", error)
        } finally {
          setLoading(false)
        }
      }
    });
  }

  // Table Component
  const handleSortChange = (field: string) => {

    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortDirection("asc")
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPerPage(Number(e.target.value))
    setCurrentPage(1)
  }


  return (
    <div className="flex-1 p-8">
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-gray-800">
            Menu Tahun Akademik
          </h1>
          <button className="flex gap-1 px-3 py-1 text-white bg-green-400 rounded-lg shadow" onClick={openAddModal}>
            Tambah
            <Icon path={mdiPlus} size={1} />
          </button>
        </div>

        <Table
          data={tahunAkademik}
          columns={tahunAkademikColumn}
          loading={loading}
          headerClassName="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer"
          cellClassName="px-6 py-4 text-sm text-gray-500 whitespace-nowrap"
          searchTerm={searchTerm}
          handleSearch={handleSearch}
          perPage={perPage}
          handlePerPageChange={handlePerPageChange}
          totalPages={totalPages}
          totalItems={totalItems}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
          handleSortChange={handleSortChange}
          sortDirection={sortDirection} />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        data={tahunAkademik}
        title="Tahun Akademik"
        fields={tahunAkademikFields}
        apiEndpoint="/academic-year"
        modalType={modalType}
        dataId={editData}
      />
    </div>
  )
}

export default TahunAkademikPage
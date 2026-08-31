// ---------- 高级表格样式 ----------
// 纯对象，用于 VNode 的 style 属性

export const tableStyles = {
  container: {
    width: '100%',
    overflow: 'auto',
    border: '1px solid #e8e8e8',
    borderRadius: '8px',
    background: 'white'
  },
  header: {
    display: 'flex',
    background: '#fafafa',
    borderBottom: '1px solid #e8e8e8',
    fontWeight: '600',
    fontSize: '14px'
  },
  headerCell: {
    padding: '12px 16px',
    flex: 1,
    minWidth: '100px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  row: {
    display: 'flex',
    borderBottom: '1px solid #f0f0f0',
    transition: 'background 0.15s'
  },
  rowHover: {
    background: '#fafafa'
  },
  cell: {
    padding: '12px 16px',
    flex: 1,
    minWidth: '100px',
    display: 'flex',
    alignItems: 'center'
  },
  sortIcon: {
    cursor: 'pointer',
    fontSize: '12px',
    color: '#bbb',
    marginLeft: '4px'
  },
  sortIconActive: {
    color: '#1890ff'
  },
  filterInput: {
    padding: '4px 8px',
    border: '1px solid #d9d9d9',
    borderRadius: '4px',
    fontSize: '12px',
    width: '100%',
    marginTop: '4px'
  },
  pagination: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    borderTop: '1px solid #f0f0f0'
  },
  paginationButton: {
    padding: '4px 12px',
    border: '1px solid #d9d9d9',
    borderRadius: '4px',
    background: 'white',
    cursor: 'pointer',
    fontSize: '13px'
  },
  paginationButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed'
  },
  paginationInfo: {
    fontSize: '13px',
    color: '#666'
  }
}
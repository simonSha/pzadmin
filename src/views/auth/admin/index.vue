<template>
  <div class="admin-box">
    <panel-head :route="route"></panel-head>
    <el-table :data="tableData.list" border style="width: 100%">
      <el-table-column prop="id" label="id" width="180" />
      <el-table-column prop="name" label="昵称" width="180" />
      <el-table-column label="所属组别" prop="permissions_id">
        <template #default="scope">
          {{ permissionsName(scope.row.permissions_id) }}
        </template>
      </el-table-column>
      <el-table-column prop="mobile" label="手机号" />
      <el-table-column prop="active" label="状态">
        <template #default="scope">
          <div>
            <el-tag v-if="scope.row.active" type="success">正常</el-tag>
            <el-tag v-else type="danger">失效</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="time_text" label="创建时间" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="primary" @click="open(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-info">
      <el-pagination
        v-model:current-page="paginationData.pageNum"
        size="small"
        :background="false"
        layout="total, prev, pager, next"
        :total="tableData.total"
        :default-page-size="paginationData.pageSize"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog
      v-model="isAdminDialogVisible"
      title="添加权限"
      width="500"
      :before-close="beforeClose"
    >
      <el-form
        ref="formRef"
        label-witth="100px"
        label-position="left"
        :model="formInfo"
        :rules="rules"
      >
        <el-form-item v-show="false" prop="id">
          <el-input v-model="formInfo.id" />
        </el-form-item>
        <el-form-item label="手机号" prop="name">
          <el-input
            v-model="formInfo.mobile"
            disabled
            placeholder="请填写手机号"
          />
        </el-form-item>
        <el-form-item label="昵称" prop="name">
          <el-input v-model="formInfo.name" placeholder="请填写手机号" />
        </el-form-item>
        <el-form-item label="菜单权限" prop="permissions_id">
          <el-select
            v-model="formInfo.permissions_id"
            placeholder="请选择菜单权限"
            style="width: 240px"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="confirm(formRef)">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { authAdmin, menuSelectList, updateAuth } from "../../../api";
import dayjs from "dayjs";
import { useRoute } from "vue-router";

const route = useRoute();

const isAdminDialogVisible = ref(false);
const formRef = ref();
const paginationData = reactive({
  pageNum: 1,
  pageSize: 10,
});

// 列表数据
const tableData = reactive({
  list: [],
  total: 0,
});

let options = ref([]);

const rules = ref({
  name: [{ required: true, trigger: "blur", message: "请填写昵称" }],
  permissions_id: [
    { required: true, trigger: "blur", message: "请选择菜单权限" },
  ],
});

const formInfo = ref({});

onMounted(() => {
  getListData();
  menuSelectList().then(({ data }) => {
    if (data.code === 10000) {
      options.value = data.data;
    }
  });
});

const getListData = () => {
  authAdmin(paginationData).then(({ data }) => {
    if (data.code === 10000) {
      const { list, total } = data.data;
      list.forEach((e) => {
        e.time_text = dayjs(e.create_time).format("YYYY-MM-DD");
      });
      tableData.list = list;
      tableData.total = total;
    }
  });
};

const open = (rowData = {}) => {
  isAdminDialogVisible.value = true;
  if (rowData) {
    formInfo.value = rowData;
    // Object.assign(formInfo, { id: rowData.id, name: rowData.name });
  }
};

const beforeClose = () => {
  isAdminDialogVisible.value = false;
  formRef.value.resetFields();
};

const confirm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      const { name, permissions_id } = formInfo.value;
      updateAuth({
        name,
        permissions_id,
      }).then(() => {
        isAdminDialogVisible.value = false;
        getListData();
      });
    } else {
      console.log("error submit!", fields);
    }
  });
};

const permissionsName = (permissions_id) => {
  const data = options.value.find((el) => el.id === permissions_id);
  return data ? data.name : "超级管理员";
};
const handleCurrentChange = (page) => {
  paginationData.pageNum = page;
  console.log(page);
  getListData();
};
</script>

<style lang="less" scoped></style>

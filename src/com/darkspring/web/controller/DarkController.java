package com.darkspring.web.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.commons.collections4.ListUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.darkspring.core.component.FetchTable;
import com.darkspring.core.component.RequestFile;

@Controller
@RequestMapping
public class DarkController {

	@GetMapping
	public ModelAndView index() {
		ModelAndView view = new ModelAndView("index");
		return view;
	}

	@GetMapping("dashboard")
	public ModelAndView dashboard() {
		ModelAndView view = new ModelAndView("dashboard");
		return view;
	}

	@GetMapping("button")
	public ModelAndView button() {
		ModelAndView view = new ModelAndView("button");
		return view;
	}

	@GetMapping("blank")
	public ModelAndView blank() {
		ModelAndView view = new ModelAndView("blank");
		return view;
	}

	@GetMapping("chart")
	public ModelAndView chart() {
		ModelAndView view = new ModelAndView("chart");
		return view;
	}

	@GetMapping("element")
	public ModelAndView element() {
		ModelAndView view = new ModelAndView("element");
		return view;
	}

	@GetMapping("error")
	public ModelAndView error() {
		ModelAndView view = new ModelAndView("error");
		return view;
	}

	@GetMapping("form")
	public ModelAndView form() {
		ModelAndView view = new ModelAndView("form");
		return view;
	}

	@GetMapping("signin")
	public ModelAndView signin() {
		ModelAndView view = new ModelAndView("signin");
		return view;
	}

	@GetMapping("signup")
	public ModelAndView signup() {
		ModelAndView view = new ModelAndView("signup");
		return view;
	}

	@GetMapping("table")
	public ModelAndView table() {
		ModelAndView view = new ModelAndView("table");
		return view;
	}

	@GetMapping("typography")
	public ModelAndView typography() {
		ModelAndView view = new ModelAndView("typography");
		return view;
	}

	@GetMapping("widget")
	public ModelAndView widget() {
		ModelAndView view = new ModelAndView("widget");
		return view;
	}

	@GetMapping("grid")
	public ModelAndView grid() {
		ModelAndView view = new ModelAndView("grid");
		return view;
	}

	@GetMapping("prompt")
	public ModelAndView prompt() {
		ModelAndView view = new ModelAndView("prompt");
		return view;
	}

	@GetMapping("dialog")
	public ModelAndView dialog() {
		ModelAndView view = new ModelAndView("dialog");
		return view;
	}

	@GetMapping("dialog-window")
	public ModelAndView dialogWindow() {
		ModelAndView view = new ModelAndView("dialog-window");
		return view;
	}

	private static final List<Map<String, String>> tableData = new ArrayList<>();

	static {
		for (int i = 0; i < 107; i++) {
			Map<String, String> data = new HashMap<>();
			data.put("data_1", "A" + i);
			data.put("data_2", "B" + i);
			data.put("data_3", "C" + i);
			tableData.add(data);
		}
	}

	@ResponseBody
	@PostMapping("getTableData")
	public FetchTable getTableData(Integer pageNum, Integer pageSize, String orderby) throws InterruptedException {
		FetchTable fetchTable = new FetchTable();
		if (pageNum != null && pageSize != null) {
			Thread.sleep(100);
			if (pageNum < 1) {
				pageNum = 1;
			}
			fetchTable.setPageNum(pageNum);
			fetchTable.setPageSize(pageSize);
			fetchTable.setTotalSize(tableData.size());

			List<Map<String, String>> copy = tableData.stream().collect(Collectors.toList());

			if (StringUtils.isNoneBlank(orderby)) {
				String key = orderby.split(" ")[0];
				String dir = orderby.split(" ")[1];
				copy.sort((m1, m2) -> {
					String v1 = m1.get(key);
					String v2 = m2.get(key);
					if (dir.equals("asc")) {
						return v1.compareTo(v2);
					} else {
						return v2.compareTo(v1);
					}
				});
			}

			List<List<Map<String, String>>> partition = ListUtils.partition(copy, pageSize);
			if (partition.size() < pageNum) {
				fetchTable.setData(new ArrayList<>());
			} else {
				fetchTable.setData(partition.get(pageNum - 1));
			}
		} else {
			fetchTable.setData(tableData);
		}
		return fetchTable;
	}

	@GetMapping("upload")
	public ModelAndView upload() {
		ModelAndView view = new ModelAndView("upload");
		return view;
	}

	@ResponseBody
	@PostMapping("doUpload")
	public void doUpload(RequestFile requestFile) {
		requestFile.getData();
	}

	@GetMapping("icons")
	public ModelAndView icons() {
		ModelAndView view = new ModelAndView("icons");
		return view;
	}

	@GetMapping("openIconView")
	public ModelAndView openIconView(String className) {
		ModelAndView view = new ModelAndView("icon-view");
		view.addObject("className", className);
		return view;
	}
	
	@GetMapping("test")
	public ModelAndView test() {
		ModelAndView view = new ModelAndView("test");
		return view;
	}

}
